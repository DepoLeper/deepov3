/**
 * UnasApiClient - Unas API kommunikáció kezelése
 * 
 * Funkcionalitás:
 * - API kulcs alapú autentikáció
 * - Bearer token management (2 óra érvényesség)
 * - XML alapú API kommunikáció
 * - Rate limiting és error handling
 * - Termék/kategória lekérés
 */

import { XMLParser } from 'fast-xml-parser';

export interface UnasApiConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface UnasLoginResponse {
  Token: string;
  Expire: string;
  ShopId: string;
  Subscription: string;
  Permissions: {
    Permission: string | string[];
  };
  WebshopInfo: {
    WebshopName: string;
    WebshopURL: string;
    Contact: {
      Name: string;
      Email: string;
      Phone: string;
    };
  };
}

export interface UnasProduct {
  Id: string;
  Sku: string;
  Name: string;
  Description?: string;
  Price?: number;
  Category?: string;
  Status?: string;
  Images?: string[];
  Variants?: Array<{
    Id: string;
    Name: string;
    Value: string;
  }>;
}

export interface UnasCategory {
  Id: string;
  Name: string;
  Description?: string;
  ParentId?: string;
  Products?: UnasProduct[];
}

export class UnasApiClient {
  private config: UnasApiConfig;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;
  private xmlParser: XMLParser;

  constructor(config: UnasApiConfig) {
    this.config = {
      baseUrl: 'https://api.unas.eu/shop',
      timeout: 30000,
      ...config
    };

    // XML parser konfiguráció
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@',
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      ignoreNameSpace: false,
      alwaysCreateTextNode: false,
      parseTagValue: true,
      textNodeName: '#text',
      cdataTagName: '__cdata',
      cdataPositionChar: '\\c',
      isArray: (tagName: string) => {
        // Tömb elemek definiálása
        return ['Permission', 'Product', 'Category', 'Item', 'Variant'].includes(tagName);
      }
    });

    console.log('🌐 UnasApiClient inicializálva');
  }

  /**
   * API token lekérése/frissítése
   */
  private async authenticate(): Promise<void> {
    // Ellenőrizzük, hogy van-e érvényes token
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      console.log('🔑 Meglévő token használata');
      return;
    }

    console.log('🔑 Unas API autentikáció kezdése...');

    const loginXml = `<?xml version="1.0" encoding="UTF-8" ?>
      <Params>
        <ApiKey>${this.config.apiKey}</ApiKey>
        <WebshopInfo>true</WebshopInfo>
      </Params>`;

    try {
      const response = await fetch(`${this.config.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        body: loginXml,
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      console.log('📥 Login válasz XML:', xmlResponse.substring(0, 200) + '...');

      const parsed = this.xmlParser.parse(xmlResponse);
      const loginData = parsed.Response || parsed;

      if (!loginData.Token) {
        throw new Error('No token received from login');
      }

      this.token = loginData.Token;
      this.tokenExpiry = new Date(loginData.Expire);
      
      console.log('✅ Unas API autentikáció sikeres');
      console.log(`🛍️ Webáruház: ${loginData.WebshopInfo?.WebshopName}`);
      console.log(`📅 Token lejárat: ${this.tokenExpiry.toLocaleString()}`);
      console.log(`🏪 Webáruház URL: ${loginData.WebshopInfo?.WebshopURL}`);

    } catch (error) {
      console.error('❌ Unas API autentikáció hiba:', error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Autentikált API kérés küldése
   */
  private async makeRequest(endpoint: string, xmlBody: string): Promise<any> {
    // Autentikáció biztosítása
    await this.authenticate();

    if (!this.token) {
      throw new Error('No authentication token available');
    }

    console.log(`📤 Unas API kérés: ${endpoint}`);

    try {
      const response = await fetch(`${this.config.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'Authorization': `Bearer ${this.token}`
        },
        body: xmlBody,
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      console.log(`📥 ${endpoint} válasz mérete:`, xmlResponse.length, 'karakter');

      return this.xmlParser.parse(xmlResponse);

    } catch (error) {
      console.error(`❌ ${endpoint} kérés hiba:`, error);
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Termékek lekérése
   */
  async getProducts(options: {
    sku?: string;
    categoryId?: number;
    limit?: number;
    contentType?: 'minimal' | 'short' | 'normal' | 'full';
  } = {}): Promise<UnasProduct[]> {
    console.log('🛒 Termékek lekérése:', options);

    const params: string[] = [];
    
    if (options.sku) params.push(`<Sku>${options.sku}</Sku>`);
    if (options.categoryId) params.push(`<CategoryId>${options.categoryId}</CategoryId>`);
    if (options.limit) params.push(`<LimitNum>${options.limit}</LimitNum>`);
    if (options.contentType) params.push(`<ContentType>${options.contentType}</ContentType>`);

    const xmlBody = `<?xml version="1.0" encoding="UTF-8" ?>
      <Params>
        ${params.join('\n        ')}
      </Params>`;

    try {
      const response = await this.makeRequest('getProduct', xmlBody);
      const products = this.parseProducts(response);
      
      console.log(`✅ ${products.length} termék lekérve`);
      return products;

    } catch (error) {
      console.error('❌ Termék lekérés hiba:', error);
      throw error;
    }
  }

  /**
   * Kategóriák lekérése
   */
  async getCategories(options: {
    id?: number;
    limit?: number;
  } = {}): Promise<UnasCategory[]> {
    console.log('📁 Kategóriák lekérése:', options);

    const params: string[] = [];
    
    if (options.id) params.push(`<Id>${options.id}</Id>`);
    if (options.limit) params.push(`<LimitNum>${options.limit}</LimitNum>`);

    const xmlBody = `<?xml version="1.0" encoding="UTF-8" ?>
      <Params>
        ${params.join('\n        ')}
      </Params>`;

    try {
      const response = await this.makeRequest('getCategory', xmlBody);
      const categories = this.parseCategories(response);
      
      console.log(`✅ ${categories.length} kategória lekérve`);
      return categories;

    } catch (error) {
      console.error('❌ Kategória lekérés hiba:', error);
      throw error;
    }
  }

  /**
   * Termék adatok parsing
   */
  private parseProducts(response: any): UnasProduct[] {
    if (!response.Products || !response.Products.Product) {
      return [];
    }

    const products = Array.isArray(response.Products.Product) 
      ? response.Products.Product 
      : [response.Products.Product];

    return products.map((product: any) => ({
      Id: product.Id?.toString() || '',
      Sku: product.Sku || '',
      Name: product.Name || '',
      Description: product.Description || '',
      Price: product.Price ? parseFloat(product.Price) : undefined,
      Category: product.Category || '',
      Status: product.Status || '',
      Images: product.Images ? (Array.isArray(product.Images) ? product.Images : [product.Images]) : [],
      Variants: product.Variants ? this.parseVariants(product.Variants) : []
    }));
  }

  /**
   * Kategória adatok parsing
   */
  private parseCategories(response: any): UnasCategory[] {
    if (!response.Categories || !response.Categories.Category) {
      return [];
    }

    const categories = Array.isArray(response.Categories.Category) 
      ? response.Categories.Category 
      : [response.Categories.Category];

    return categories.map((category: any) => ({
      Id: category.Id?.toString() || '',
      Name: category.Name || '',
      Description: category.Description || '',
      ParentId: category.ParentId?.toString() || undefined
    }));
  }

  /**
   * Variánsok parsing
   */
  private parseVariants(variants: any): Array<{Id: string; Name: string; Value: string}> {
    if (!variants.Variant) return [];

    const variantList = Array.isArray(variants.Variant) ? variants.Variant : [variants.Variant];
    
    return variantList.map((variant: any) => ({
      Id: variant.Id?.toString() || '',
      Name: variant.Name || '',
      Value: variant.Value || ''
    }));
  }

  /**
   * API kapcsolat tesztelése
   */
  async testConnection(): Promise<{success: boolean; message: string; data?: any}> {
    try {
      console.log('🔍 Unas API kapcsolat tesztelése...');
      
      await this.authenticate();
      
      // Próbálunk lekérni néhány terméket
      const testProducts = await this.getProducts({ limit: 5, contentType: 'minimal' });
      
      return {
        success: true,
        message: `✅ Kapcsolat sikeres! ${testProducts.length} termék elérhető`,
        data: {
          tokenValid: !!this.token,
          tokenExpiry: this.tokenExpiry?.toISOString(),
          sampleProducts: testProducts.slice(0, 3)
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `❌ Kapcsolat hiba: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Singleton instance exportálása
let unasApiClient: UnasApiClient | null = null;

export function getUnasApiClient(config?: UnasApiConfig): UnasApiClient {
  if (!unasApiClient && config) {
    unasApiClient = new UnasApiClient(config);
  }
  
  if (!unasApiClient) {
    throw new Error('UnasApiClient not initialized. Provide config on first call.');
  }
  
  return unasApiClient;
}

export default UnasApiClient; 