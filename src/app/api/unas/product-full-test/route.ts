import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('id') || '1306870988'; // Jegyzettömb
  
  try {
    const apiKey = process.env.UNAS_API_KEY!;
    
    // Login
    const loginXml = `<?xml version="1.0" encoding="UTF-8"?><Params><ApiKey>${apiKey}</ApiKey></Params>`;
    
    const loginRes = await fetch('https://api.unas.eu/shop/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: loginXml
    });
    
    const loginText = await loginRes.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      processEntities: true,
      trimValues: true,
      cdataPropName: "__cdata",
      parseCDATA: true
    });
    
    const loginParsed = parser.parse(loginText);
    const token = loginParsed.Login?.Token;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token'
      }, { status: 500 });
    }
    
    // FULL termék lekérés - minden mezővel
    const productXml = `<?xml version="1.0" encoding="UTF-8"?><Params><Id>${productId}</Id><ContentType>full</ContentType></Params>`;
    
    console.log('📤 Full product request for ID:', productId);
    
    const productRes = await fetch('https://api.unas.eu/shop/getProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
        'Authorization': `Bearer ${token}`
      },
      body: productXml
    });
    
    const productText = await productRes.text();
    const productParsed = parser.parse(productText);
    
    // Részletes elemzés
    const product = productParsed.Products?.Product;
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Termék nem található',
        productId
      });
    }
    
    // Mezők kategorizálása
    const analysis = {
      basicInfo: {
        id: product.Id,
        sku: product.Sku,
        name: product.Name?.__cdata || product.Name,
        unit: product.Unit?.__cdata || product.Unit,
        state: product.State,
        createTime: product.CreateTime,
        lastModTime: product.LastModTime
      },
      
      pricing: {
        prices: product.Prices,
        tax: product.Tax,
        discounts: product.Discounts
      },
      
      stock: {
        stock: product.Stock,
        minimumQty: product.MinimumQty,
        packageProduct: product.PackageProduct
      },
      
      categories: {
        categories: product.Categories,
        manufacturer: product.Manufacturer,
        tags: product.Tags
      },
      
      content: {
        description: product.Description,
        shortDescription: product.ShortDescription,
        seoTitle: product.SeoTitle,
        seoDescription: product.SeoDescription,
        seoKeywords: product.SeoKeywords
      },
      
      images: {
        images: product.Images,
        defaultImage: product.DefaultImage
      },
      
      attributes: {
        parameters: product.Parameters,
        properties: product.Properties,
        customFields: product.CustomFields
      },
      
      shipping: {
        weight: product.Weight,
        shipping: product.Shipping,
        dimensions: product.Dimensions
      },
      
      otherFields: {}
    };
    
    // Nem kategorizált mezők összegyűjtése
    const knownFields = new Set([
      'Id', 'Sku', 'Name', 'Unit', 'State', 'CreateTime', 'LastModTime',
      'Prices', 'Tax', 'Discounts', 'Stock', 'MinimumQty', 'PackageProduct',
      'Categories', 'Manufacturer', 'Tags', 'Description', 'ShortDescription',
      'SeoTitle', 'SeoDescription', 'SeoKeywords', 'Images', 'DefaultImage',
      'Parameters', 'Properties', 'CustomFields', 'Weight', 'Shipping', 'Dimensions',
      'Statuses'
    ]);
    
    Object.keys(product).forEach(key => {
      if (!knownFields.has(key)) {
        analysis.otherFields[key] = product[key];
      }
    });
    
    return NextResponse.json({
      success: true,
      productId,
      xmlLength: productText.length,
      fieldCount: Object.keys(product).length,
      analysis,
      rawProduct: product
    });
    
  } catch (error: any) {
    console.error('❌ Full product test hiba:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 