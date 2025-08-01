import { NextRequest, NextResponse } from 'next/server';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.UNAS_API_KEY;
    const baseUrl = process.env.UNAS_API_URL || 'https://api.unas.eu/shop';
    
    console.log('🔍 Debug Login Test');
    console.log(`API Key: ${apiKey?.substring(0, 10)}... (length: ${apiKey?.length})`);
    console.log(`Base URL: ${baseUrl}`);

    // XML Builder használata az eredeti kódnak megfelelően
    const xmlBuilder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      cdataPropName: "__cdata"
    });

    const loginRequest = {
      '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
      Params: {
        ApiKey: apiKey,
        WebshopInfo: 'true'
      }
    };

    const xmlBody = xmlBuilder.build(loginRequest);
    console.log('📤 XML Request:', xmlBody);

    const response = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xmlBody
    });

    const responseText = await response.text();
    console.log(`📊 Response Status: ${response.status}`);
    console.log('📥 Response Text:', responseText);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        requestXml: xmlBody,
        responseText: responseText,
        apiKeyLength: apiKey?.length || 0,
        url: `${baseUrl}/api/login`
      });
    }

    const xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      cdataPropName: "__cdata",
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true
    });

    const parsed = xmlParser.parse(responseText);

    return NextResponse.json({
      success: true,
      parsed: parsed,
      token: parsed.Login?.Token,
      requestXml: xmlBody,
      responseText: responseText
    });

  } catch (error: any) {
    console.error('❌ Debug Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 