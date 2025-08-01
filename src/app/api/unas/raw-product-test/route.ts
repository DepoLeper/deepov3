import { NextRequest, NextResponse } from 'next/server';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export async function GET() {
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
      trimValues: true
    });
    
    const loginParsed = parser.parse(loginText);
    const token = loginParsed.Login?.Token;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token in login response',
        loginResponse: loginText.substring(0, 500)
      });
    }
    
    // Product list lekérés
    const productXml = `<?xml version="1.0" encoding="UTF-8"?><Params><StatusBase>1</StatusBase><State>live</State><ContentType>minimal</ContentType><LimitNum>2</LimitNum></Params>`;
    
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
    
    return NextResponse.json({
      success: true,
      token: token.substring(0, 20) + '...',
      productResponse: {
        status: productRes.status,
        statusText: productRes.statusText,
        xmlLength: productText.length,
        xmlPreview: productText.substring(0, 500),
        parsed: productParsed
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 