import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export interface UnasApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface UnasLoginResponse {
  token: string;
  expire: string;
  shopId: string;
  subscription: string;
}

export interface UnasProductBasic {
  id: string;
  sku: string;
  name: string;
  unit: string;
  priceNet?: number;
  priceGross?: number;
  [key: string]: any; // További mezők
}

export interface UnasProductFull extends UnasProductBasic {
  // Alap információk
  state?: string;
  createTime?: number;
  lastModTime?: number;
  
  // Készlet
  stock?: number;
  stockStatus?: boolean;
  minimumQty?: number;
  
  // Kategória
  categoryId?: string;
  categoryName?: string;
  allCategories?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  
  // Leírások
  description?: string;
  shortDescription?: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  url?: string;
  sefUrl?: string;
  
  // Képek
  imageUrl?: string;
  imageSefUrl?: string;
  imageAlt?: string;
  
  // Súly és szállítás
  weight?: number;
  
  // Paraméterek
  parameters?: Array<{
    id: string;
    name: string;
    value: string;
    group?: string;
  }>;
  
  // Speciális árak (vevőcsoportok)
  specialPrices?: Array<{
    groupId: string;
    groupName: string;
    priceNet: number;
    priceGross: number;
    isCustomerGroup?: boolean; // Vevőcsoport kedvezmény
    discountPercent?: number | null;
  }>;
  
  // Valódi akciós árak (időszakos)
  salePrice?: {
    net: number;
    gross: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  };
  
  // Vevőcsoport akciós árak  
  groupSalePrices?: Array<{
    groupId: string;
    groupName: string;
    saleNet: number;
    saleGross: number;
    saleStart?: string;
    saleEnd?: string;
    isActive?: boolean;
  }>;
}

export class UnasApiClient {
  private config: UnasApiConfig;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;
  private xmlParser: XMLParser;
  private xmlBuilder: XMLBuilder;

  constructor(config: UnasApiConfig) {
    this.config = {
      baseUrl: 'https://api.unas.eu/shop',
      ...config
    };

    // XML parser beállítások
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      cdataPropName: "__cdata",
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true
    });

    this.xmlBuilder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      cdataPropName: "__cdata",
      suppressEmptyNode: true
    });
  }

  /**
   * Bejelentkezés az Unas API-ba
   */
  async login(): Promise<UnasLoginResponse> {
    console.log('🔐 Unas API bejelentkezés...');
    
    const loginRequest = {
      '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
      Params: {
        ApiKey: this.config.apiKey,
        WebshopInfo: 'true'
      }
    };

    const xmlBody = this.xmlBuilder.build(loginRequest);
    
    try {
      const response = await fetch(`${this.config.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        body: xmlBody
      });

      if (!response.ok) {
        throw new Error(`HTTP hiba: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      console.log('📥 Nyers XML válasz:', xmlText.substring(0, 500) + '...');
      
      const parsed = this.xmlParser.parse(xmlText);
      console.log('📊 Parsed válasz:', JSON.stringify(parsed, null, 2));

      // Token kinyerése a Login objektumból
      const loginData = parsed.Login;
      
      if (loginData && loginData.Token) {
        this.token = loginData.Token;
        this.tokenExpiry = new Date(loginData.Expire);
        
        console.log('✅ Sikeres bejelentkezés!');
        console.log(`🎫 Token: ${this.token.substring(0, 20)}...`);
        console.log(`⏰ Lejárat: ${this.tokenExpiry}`);
        console.log(`🏪 Shop ID: ${loginData.ShopId}`);
        console.log(`📋 Subscription: ${loginData.Subscription}`);
        
        return {
          token: this.token,
          expire: loginData.Expire,
          shopId: loginData.ShopId || '',
          subscription: loginData.Subscription || ''
        };
      } else {
        console.error('❌ Login objektum hiányzik vagy nincs Token benne');
        console.error('📊 Parsed struktúra:', Object.keys(parsed));
        throw new Error('Sikertelen bejelentkezés: Token nem található a Login objektumban');
      }
    } catch (error) {
      console.error('❌ Bejelentkezési hiba:', error);
      throw new Error(`Unas API bejelentkezés sikertelen: ${error.message}`);
    }
  }

  /**
   * Token érvényességének ellenőrzése és automatikus megújítás
   */
  private isTokenValid(): boolean {
    return !!(this.token && this.tokenExpiry && new Date() < this.tokenExpiry);
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.isTokenValid()) {
      console.log('🔄 Token megújítása szükséges...');
      await this.login();
    }
  }

  /**
   * Termék lekérése - egyszerűsített verzió
   */
  async getProduct(productId?: string): Promise<UnasProductBasic | UnasProductBasic[]> {
    // Token ellenőrzés
    if (!this.isTokenValid()) {
      await this.login();
    }

    console.log(`📦 Termék lekérése: ${productId || 'lista'}`);
    
    // Egyszerű XML építés
    const params: any = {
      StatusBase: '1',
      State: 'live',
      ContentType: 'minimal',
      LimitNum: '5'
    };
    
    if (productId) {
      params.Id = productId;
    }
    
    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?><Params>${Object.entries(params).map(([k, v]) => `<${k}>${v}</${k}>`).join('')}</Params>`;
    console.log('📤 Request XML:', xmlBody);
    
    try {
      const response = await fetch(`${this.config.baseUrl}/getProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'Authorization': `Bearer ${this.token}`
        },
        body: xmlBody
      });

      if (!response.ok) {
        throw new Error(`HTTP hiba: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      console.log('📥 Response length:', xmlText.length);
      
      const parsed = this.xmlParser.parse(xmlText);
      
      // Termék feldolgozás
      if (parsed.Products?.Product) {
        const productArray = Array.isArray(parsed.Products.Product) 
          ? parsed.Products.Product 
          : [parsed.Products.Product];
        
        console.log(`✅ ${productArray.length} termék találva`);
        
        const results = productArray.map((p: any) => ({
          id: p.Id?.toString() || '',
          sku: p.Sku || '',
          name: p.Name?.__cdata || p.Name || '',
          unit: p.Unit?.__cdata || p.Unit || 'db',
          priceNet: parseFloat(p.Prices?.Price?.Net || '0'),
          priceGross: parseFloat(p.Prices?.Price?.Gross || '0')
        }));
        
        // Ha ID-val kerestünk, 1 terméket adunk vissza
        return productId ? results[0] : results;
      }
      
      // Nincs termék
      console.log('⚠️ Nincs termék a válaszban');
      return productId ? null : [];
      
    } catch (error: any) {
      console.error('❌ Termék hiba:', error.message);
      throw new Error(`Termék lekérés hiba: ${error.message}`);
    }
  }

  /**
   * Teljes termék információ lekérése
   */
  async getProductFull(productId: string): Promise<UnasProductFull | null> {
    // Token ellenőrzés
    if (!this.isTokenValid()) {
      await this.login();
    }

    console.log(`📦 Teljes termék lekérése: ID ${productId}`);
    
    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?><Params><Id>${productId}</Id><ContentType>full</ContentType></Params>`;
    
    try {
      const response = await fetch(`${this.config.baseUrl}/getProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'Authorization': `Bearer ${this.token}`
        },
        body: xmlBody
      });

      if (!response.ok) {
        throw new Error(`HTTP hiba: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      const parsed = this.xmlParser.parse(xmlText);
      
      if (parsed.Products?.Product) {
        const p = parsed.Products.Product;
        console.log('✅ Teljes termék adatok lekérve');
        
        // Alapadatok + minden további mező
        const fullProduct: UnasProductFull = {
          // Alap mezők
          id: p.Id?.toString() || '',
          sku: p.Sku || '',
          name: p.Name?.__cdata || p.Name || '',
          unit: p.Unit?.__cdata || p.Unit || 'db',
          priceNet: parseFloat(p.Prices?.Price?.Net || p.Prices?.Price?.[0]?.Net || '0'),
          priceGross: parseFloat(p.Prices?.Price?.Gross || p.Prices?.Price?.[0]?.Gross || '0'),
          
          // További információk
          state: p.State,
          createTime: p.CreateTime,
          lastModTime: p.LastModTime,
          
          // Készlet
          stock: p.Stocks?.Stock?.Qty || 0,
          stockStatus: p.Stocks?.Status?.Active === 1,
          minimumQty: p.MinimumQty || 1,
          
          // Kategória (lehet több is)
          categoryId: p.Categories?.Category?.Id?.toString(),
          categoryName: p.Categories?.Category?.Name?.__cdata || p.Categories?.Category?.Name,
          allCategories: this.parseCategories(p.Categories),
          
          // Leírások
          description: p.Description?.Long?.__cdata || p.Description?.Long,
          shortDescription: p.Description?.Short?.__cdata || p.Description?.Short,
          
          // SEO
          seoTitle: p.AutomaticMeta?.Title?.__cdata || p.AutomaticMeta?.Title,
          seoDescription: p.AutomaticMeta?.Description?.__cdata || p.AutomaticMeta?.Description,
          seoKeywords: p.AutomaticMeta?.Keywords?.__cdata || p.AutomaticMeta?.Keywords,
          url: p.Url?.__cdata || p.Url,
          sefUrl: p.SefUrl?.__cdata || p.SefUrl,
          
          // Képek
          imageUrl: p.Images?.Image?.Url?.Medium || p.Images?.Image?.[0]?.Url?.Medium,
          imageSefUrl: p.Images?.Image?.SefUrl?.__cdata || p.Images?.Image?.[0]?.SefUrl?.__cdata,
          imageAlt: p.Images?.Image?.Alt?.__cdata || p.Images?.Image?.[0]?.Alt?.__cdata,
          
          // Súly
          weight: p.Weight || 0,
          
          // Paraméterek
          parameters: this.parseParameters(p.Params?.Param),
          
          // Speciális árak
          specialPrices: this.parseSpecialPrices(p.Prices?.Price),
          
          // Akciós árak
          salePrice: this.parseSalePrice(p.Prices?.Price),
          groupSalePrices: this.parseGroupSalePrices(p.Prices?.Price)
        };
        
        return fullProduct;
      }
      
      console.log('⚠️ Termék nem található');
      return null;
      
    } catch (error: any) {
      console.error('❌ Teljes termék hiba:', error.message);
      throw new Error(`Teljes termék lekérés hiba: ${error.message}`);
    }
  }

  /**
   * Paraméterek feldolgozása
   */
  private parseParameters(params: any): UnasProductFull['parameters'] {
    if (!params) return [];
    
    const paramArray = Array.isArray(params) ? params : [params];
    
    return paramArray.map(p => ({
      id: p.Id?.toString() || '',
      name: p.Name?.__cdata || p.Name || '',
      value: p.Value?.__cdata || p.Value || '',
      group: p.Group?.__cdata || p.Group
    }));
  }

  /**
   * Vevőcsoport árak feldolgozása (nem akciós)
   */
  private parseSpecialPrices(prices: any): UnasProductFull['specialPrices'] {
    if (!prices || !Array.isArray(prices)) return [];
    
    return prices
      .filter(p => p.Type === 'special' && p.Group)
      .map(p => {
        const groupName = p.GroupName?.__cdata || p.GroupName || '';
        const hasDiscount = groupName.includes('-') && groupName.includes('%');
        
        return {
          groupId: p.Group?.toString() || '',
          groupName: groupName,
          priceNet: parseFloat(p.Net || '0'),
          priceGross: parseFloat(p.Gross || '0'),
          isCustomerGroup: true,
          discountPercent: hasDiscount ? this.extractDiscountPercent(groupName) : null
        };
      });
  }

  /**
   * Kedvezmény százalék kinyerése
   */
  private extractDiscountPercent(groupName: string): number | null {
    const match = groupName.match(/-(\d+)%/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Sale típusú akciós ár feldolgozása
   */
  private parseSalePrice(prices: any): UnasProductFull['salePrice'] {
    if (!prices || !Array.isArray(prices)) return undefined;
    
    const salePrice = prices.find(p => p.Type === 'sale');
    if (!salePrice) return undefined;
    
    const startDate = salePrice.Start;
    const endDate = salePrice.End;
    const now = new Date();
    const start = startDate ? new Date(startDate.replace(/\./g, '-')) : null;
    const end = endDate ? new Date(endDate.replace(/\./g, '-')) : null;
    
    // Akció aktív-e jelenleg
    const isActive = (!start || start <= now) && (!end || end >= now);
    
    return {
      net: parseFloat(salePrice.Net || '0'),
      gross: parseFloat(salePrice.Gross || '0'),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isActive: isActive
    };
  }

  /**
   * Vevőcsoport akciós árak feldolgozása (SaleNet/SaleGross)
   */
  private parseGroupSalePrices(prices: any): UnasProductFull['groupSalePrices'] {
    if (!prices || !Array.isArray(prices)) return [];
    
    return prices
      .filter(p => p.Type === 'special' && p.SaleNet && p.SaleGross)
      .map(p => {
        const startDate = p.SaleStart;
        const endDate = p.SaleEnd;
        const now = new Date();
        const start = startDate ? new Date(startDate.replace(/\./g, '-')) : null;
        const end = endDate ? new Date(endDate.replace(/\./g, '-')) : null;
        
        // Akció aktív-e jelenleg
        const isActive = (!start || start <= now) && (!end || end >= now);
        
        return {
          groupId: p.Group?.toString() || '',
          groupName: p.GroupName?.__cdata || p.GroupName || '',
          saleNet: parseFloat(p.SaleNet || '0'),
          saleGross: parseFloat(p.SaleGross || '0'),
          saleStart: startDate || undefined,
          saleEnd: endDate || undefined,
          isActive: isActive
        };
      });
  }

  /**
   * Kategóriák feldolgozása
   */
  private parseCategories(categories: any): UnasProductFull['allCategories'] {
    if (!categories) return [];
    
    // Lehet egyetlen Category vagy Category array
    const categoryArray = categories.Category ? 
      (Array.isArray(categories.Category) ? categories.Category : [categories.Category]) : [];
    
    return categoryArray.map((cat: any) => ({
      id: cat.Id?.toString() || '',
      name: cat.Name?.__cdata || cat.Name || '',
      type: cat.Type || 'unknown'
    }));
  }

  /**
   * Termékek listázása (később)
   */
  async getProducts(limit: number = 10, start: number = 0): Promise<UnasProductBasic[]> {
    // TODO: Implementálás a későbbi fázisokban
    throw new Error('getProducts még nincs implementálva - fókusz: 1 termék');
  }
} 
