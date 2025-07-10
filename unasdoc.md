Azonosítás
Az Unas API használatának első lépése az azonosítás elvégzése.
API kulcs alapú azonosítás
Az áruház adminisztrációs felületén a Beállítások / Külső kapcsolatok / API kapcsolat menüben hozhatsz létre API kulcsot. Itt beállíthatod azt is, hogy az adott API kulcs segítségével milyen API funkciók legyenek elérhetők. A végpontnál az alábbi limitek élnek:
Sikeres hívások maximális száma:
PREMIUM 2000 hívás / óra
VIP 6000 hívás / óra
A limittől függetlenül NEM ajánljuk az ilyen gyakori lekéréseket, mivel egy sikeres kérés által visszakapott token 2 órán keresztül használható!
Sikertelen hívások maximális száma: 5 / óra


Felhasználónév alapú azonosítás
Korábban elérhető volt az Unas API kapcsán a felhasználónév és jelszó alapú azonosítási mód is, melyet új integrációk kiépítésekor már nem támogatunk, csak a korábban ilyen módon kiépített megoldások használhatják. Helyette az API kulcs típusú azonosítási mód ajánlott.
Login kérés
Bármely API funkció használata előtt belépés szükséges, ehhez a "login" API funkció használható. A login kérés válasz formátumáról az Login válasz fejezetben olvashatsz.
ApiKey   string
Az admin felületen létrehozott API kulcs.
WebshopInfo   string
Az adott webáruházról üzemeltetői és egyéb technikai adatokat is láthatsz a generált válaszban.
Használható értékek
true
Login válasz
A visszakapott token Bearer autorizációs HTTP fejlécként használandó a későbbi hívásokhoz. A lejárati időn belül a token több híváshoz is használható, így NEM szükséges minden más hívás előtt a login kérés. Megfelelő API kulcs megadása esetén a sikeres XML válaszban az alábbi adatok jelennek meg.
Token   string
A későbbi hívásoknál használandó folyamat azonosító token.
Expire   string
A token érvényességének lejárati időpontja.
ShopId   string
A webáruház Unas rendszerbeli egyedi azonosítója.
Subscription   string
A webáruház Unas rendszerbeli előfizetési csomagja.
Permissions   object
Az API kulcshoz tartozó jogosultságok.
Permissions.Permission   string
Egy konkrét végpont, melyhez biztosított a hozzáférés.
Lehetséges értékek
getOrder
setOrder
getStock
setStock
getProduct
setProduct
getProductDB
setProductDB
getProductParameter
setProductParameter
getCategory
setCategory
getCustomer
setCustomer
checkCustomer
getCustomerGroup
setCustomerGroup
getNewsletter
setNewsletter
getScriptTag
setScriptTag
getPage
setPage
getPageContent
setPageContent
getStorage
setStorage
getAutomatism
setAutomatism
getOrderStatus
setOrderStatus
getCoupon
setCoupon
getMethod
setMethod
getOrderType
setOrderType
WebshopInfo   object
A webáruházra vonatkozó egyéb technikai adatok.
WebshopInfo.WebshopName   string
A webáruház neve.
WebshopInfo.WebshopURL   string
A webáruház elérési URL-je.
WebshopInfo.Contact   object
Kapcsolattartói adatok.
WebshopInfo.Contact.Name   string
Kapcsolattartó neve.
WebshopInfo.Contact.Email   string
Kapcsolattartó email címe.
WebshopInfo.Contact.Phone   string
Kapcsolattartó telefonszáma.
WebshopInfo.Contact.Mobile   string
Kapcsolattartó mobiltelefonszáma.
WebshopInfo.Trader   object
Webáruház üzemeltetőre vonatkozó adatok.
WebshopInfo.Trader.Name   string
Webáruház üzemeltető neve.
WebshopInfo.Trader.Country   string
Webáruház üzemeltető országa.
WebshopInfo.Trader.ZIP   string
Webáruház üzemeltető irányítószáma.
WebshopInfo.Trader.County   string
Webáruház üzemeltető megyéje.
WebshopInfo.Trader.City   string
Webáruház üzemeltető települése.
WebshopInfo.Trader.Address   string
Webáruház üzemeltető pontos címe.
WebshopInfo.Trader.Phone   string
Webáruház üzemeltető telefonszáma.
WebshopInfo.Trader.Fax   string
Webáruház üzemeltető fax száma.
WebshopInfo.Trader.VAT   string
Webáruház üzemeltető adószáma.
WebshopInfo.Trader.EUVAT   string
Webáruház üzemeltető közösségi (EU) adószáma.
WebshopInfo.Trader.Email   string
Webáruház üzemeltető email címe.
WebshopInfo.Trader.RegistrationNumber   string
Cég esetén a webáruház üzemeltető cégjegyzékszáma.
WebshopInfo.Trader.RegistrationCourt   string
Cégjegyzéket vezető bíróság.
WebshopInfo.Trader.RegistrationNumberSE   string
Egyéni vállalkozó nyilvántartási száma.
WebshopInfo.Trader.License   string
Működési engedély száma.
WebshopInfo.Trader.RegistrationDate   string
Nyilvántartásba vétel időpontja.
WebshopInfo.Trader.BankAccount   string
Webáruház üzemletető bankszámlaszáma.
WebshopInfo.Trader.IBAN   string
Webáruház üzemletető IBAN azonosítója.
WebshopInfo.Trader.Address   string
Személyes átvételi cím (ha más, mint a székhely).
WebshopInfo.Trader.Website   string
Weboldal címe.
WebshopInfo.PlusData   object
További, egyedileg megadott adatok.
WebshopInfo.PlusData.Data   object
Egy konkrét megadott további adat.
WebshopInfo.PlusData.Data.Name   string
Egy konkrét megadott további adat neve.
WebshopInfo.PlusData.Data.Value   string
Egy konkrét megadott további adat értéke.
Status   string
Azonosítás státusza.
Lehetséges értékek
ok
Példák
Minta API kulcsos azonosításhoz
Az alábbi PHP példa alapján áttekinthetőek az API hívás szükséges lépései. Természetesen bármilyen programozási nyelven megvalósítható ugyanez a felépítés.
<?php

//////////////////////////////////////////////////
/// curl init
$curl = curl_init();
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_POST, TRUE);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

///////////////////////////////////////////////////////////////////
/// login
$request='<?xml version="1.0" encoding="UTF-8" ?>
			<Params>
				<ApiKey>abc123</ApiKey>
				<WebshopInfo>true</WebshopInfo>
			</Params>';
			
curl_setopt($curl, CURLOPT_URL, "https://api.unas.eu/shop/login");
curl_setopt($curl, CURLOPT_POSTFIELDS,$request);
$response = curl_exec($curl);
$xml=simplexml_load_string($response);
$token=(string)$xml->Token;

///////////////////////////////////////////////////////////////////
/// getOrder
$headers=array();
$headers[]="Authorization: Bearer ".$token;

$request='<?xml version="1.0" encoding="UTF-8" ?>
			<Params>
				<Key>123456</Key>
			</Params>';
			
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_URL, "https://api.unas.eu/shop/getOrder");
curl_setopt($curl, CURLOPT_POSTFIELDS,$request);
$response = curl_exec($curl);
echo $response;

///////////////////////////////////////////////////////////////////
/// getProduct
$headers=array();
$headers[]="Authorization: Bearer ".$token;

$request='<?xml version="1.0" encoding="UTF-8" ?>
			<Params>
				<Id>654321</Id>
			</Params>';
			
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_URL, "https://api.unas.eu/shop/getProduct");
curl_setopt($curl, CURLOPT_POSTFIELDS,$request);
$response = curl_exec($curl);
echo $response;

?>
Limitációk
Biztonsági okokból sikeres és sikertelen hívások számát is limitáljuk. A limitek megsértése esetén minden esetben 1 órára letiltjuk IP cím alapján a kliens hozzáférését az adott webáruházhoz. Sikeres hívások esetén minden végpontnál külön jelezzük az arra vonatkozó limitációkat. Sikertelen hívások maximális száma minden végponton 20 db, sikeres hívás azonban lenullázza a sikertelen hívás számlálót.
Óránként maximum küldhető hívások száma egy IP címről:
PREMIUM 2000 hívás / óra
VIP 6000 hívás / óra
Tiltás esetén a válaszban jelezzük, hogy az adott végpont pontosan mikor lesz újra használható:
<?xml version="1.0" encoding="UTF-8" ?>
<Error>Too much getOrder query, IP is banned till 02.28.2022 10:00:00</Error>


A set hívás esetén felküldhető XML maximális mérete 128 MB lehet.
Ha 10 perc alatt 10 olyan hívás érkezik, ami alapján webáruház nem azonosítóható (pl.: hibás API kulcs, hibás autentikációs adatok, stb...), akkor az IP címet letiltjuk, így arról egyik webáruház API felülete sem lesz elérhető, az API semmilyen választ nem küld 2 órán keresztül.
Megrendelések
Az áruházadban levő vásárlói rendeléseket tudod kezelni, le lehet kérni a különböző adatokat, információkat, valamint lehetőséged van új rendelések rögzítésére és a meglévő adatok módosítására.
getOrder
A getOrder végponttal listázhatók az áruházban leadott megrendelések a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getOrder
A getOrder kérésben láthatod, hogy milyen módon lehet a megrendeléseket listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy megrendelés lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több megrendelés lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setOrder
A setOrder végpont használatával tudod a megrendeléseidet létrehozni illetve módosítani.
Végpont: https://api.unas.eu/shop/setOrder
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setOrder kérést, melynek válaszát a setOrder válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 megrendelést tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 megrendelést tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getOrder kérés
getOrder kérésben határozhatod meg, milyen feltételek alapján szeretnéd a megrendeléseket listázni. A getOrder kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Ha nem kerül megadásra lekérési limit, a rendszer automatikusan az alapértelmezett értékkel dolgozik, így maximum 500 rendelés adatai kerülnek átadásra a kliens felé.
Status   string
A megrendelés státuszának sorszáma vagy a megrendelés státusz típusa használható ebben a mezőben.
Lehetséges megrendelés státusz típusok
open_normal Normál nyitott
open_prepare Feldolgozáson kívüli
close_ok Sikeresen lezárt
close_fault Sikertelenül lezárt
StatusName   string
Megrendelés státusz neve alapján szűrheted a válaszban megjelenő megrendeléseket. Több megrendelés státusz megnevezés is használható pipe karakterrel elválasztva.
StatusID   string
Megrendelés státusz egyedi azonosítója alapján szűrheted a válaszban megjelenő megrendeléseket. Több megrendelés státusz azonosító is használható vesszővel elválasztva.
Email   string
A mezőben meghatározott email címhez köthető megrendelésekre szűrhetsz.
InvoiceStatus   enum
A megrendelések számlázási státusza alapján szűrheted a válaszban megjelenő megrendelések listáját.
Használható értékek
0 Nem számlázható
1 Számlázható
2 Számlázva
InvoiceAutoSet   integer
A rendelés számlázási státusza automatikusan "Számlázva" értéket vesz fel, ha a getOrder kérésben szerepel ez a mező. Gyakorlati haszna, hogy ha egyszer egy számlázó program lekéri a megrendeléseket, nem kell egy külön setOrder hívással "Számlázva" státuszba állítani a rendeléseket, mivel ez automatán megtörténik.
Használható értékek
0 1
TimeStart   unix timestamp
A mezőben meghatározott időbélyeg után leadott megrendelések jelennek meg a válaszban.
TimeEnd   unix timestamp
A mezőben meghatározott időbélyeg előtt leadott megrendelések jelennek meg a válaszban.
DateStart   date
A mezőben meghatározott dátum után leadott megrendelések jelennek meg a válaszban, várt formátum: YYYY.MM.DD.
DateEnd   date
A mezőben meghatározott dátum előtt leadott megrendelések jelennek meg a válaszban, várt formátum: YYYY.MM.DD.
TimeModStart   unix timestamp
A mezőben meghatározott időbélyeg után módosított megrendelések jelennek meg a válaszban.
TimeModEnd   unix timestamp
A mezőben meghatározott időbélyeg előtt módosított megrendelések jelennek meg a válaszban.
LimitNum   integer
Ha nem az összes megrendelést szeretnéd látni a válaszban, akkor ebben a mezőben mondhatod meg azt, hogy maximum hány megrendelés szerepeljen a válaszban. Pozitív egész számot vár a rendszer, maximum értéke 500 lehet.
LimitStart   integer
Ha nem az összes rendelést szeretnéd listázni, akkor ebben a mezőben meghatározhatod, hogy hányadik megrendeléstől induljon a listázás. Pozitív egész számot vár, csak a LimitNum paraméterrel együtt használható.
Key   integer
A megrendelés egyedi azonosítója. Csak az ebben a mezőben meghatározott azonosítójú megrendelés szerepel majd a válaszban.
Lang   enum
A listázott megrendelések nyelve.
Használható értékek
base A webáruházban beállított alap nyelv.
customer A nyelv, amin a vásárló leadta a megrendelést.
getOrder válasz
A getOrder kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setOrder kérés
A setOrder kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setOrder válasz
A setOrder válaszban láthatod az információkat a módosított illetve létrehozott megrendelésekről. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, melyek az alábbiak lehetnek.
add Hozzáadás
modify Módosítás
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A megrendelések kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getOrder kérésre a választ, illetve ilyen formában kell beküldened a setOrder kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük, hogy melyik adattag használható a getOrder illetve setOrder végpontokhoz a GET illetve SET jelölések mentén.
Action   enum SET
Az API hívásban használt művelet, csak setOrder végpont esetén használható.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Key   string GET SET
A megrendelés azonosítója. A setOrder funkciónál csak azonosításra használható. Korábban törölt rendelés azonosítóját újra kioszthatjuk!
InternalKey   string GET
Amennyiben a rendelést eredetileg egy külső rendszerben adták le (pl. Emag, Árukereső.hu), ebben az adattagban látható az Unas rendszerbeli rendelés azonosító (ilyen rendelésnél a normál Key mezőben a külső rendszerbeli rendelés azonosító található).
Id   string GET
A megrendelés egyedi azonosítója. A setOrder funkciónál azonosításra NEM használható, erre a célra a Key node-ot kell használni.
Date   string GET SET
A megrendelés időpontja. A setOrder funkciónál csak új megrendelés rögzítésekor használható.
DateMod   string GET
A megrendelés utolsó módosításának időpontja.
Lang   string GET SET
A megrendelés során használt nyelv. setOrder végpont használatakor csak "add" típus esetén vesszük figyelembe.
Customer   object GET SET
A vásárló adatai.
Customer.Id   integer GET SET
A vásárló egyedi azonosítója. A válaszban akkor szerepel, ha regisztrált vásárló adta le a megrendelést, setOrder esetén csak azonosításra használható.
Customer.Email   string GET SET
A vásárló e-mail címe, ha a vásárlóhoz tartozik e-mail cím.
Customer.EmailWarning   string GET
Ha az email cím nem létezik, vagy a létezését nem lehetett ellenőrizni, akkor node értéke 1.
Customer.Username   string GET SET
A vásárló felhasználóneve, ha a vásárlóhoz tartozik felhasználónév.
Customer.Contact   object GET SET
A kapcsolattartó adatai.
Customer.Contact.Name   string GET SET
A kapcsolattartó neve.
Customer.Contact.Phone   string GET SET
A kapcsolattartó telefonszáma.
Customer.Contact.Mobile   string GET SET
A kapcsolattartó mobiltelefon száma.
Customer.Addresses   object GET SET
A megrendeléshez tartozó szállítási és számlázási címek.
Customer.Addresses.Invoice   object GET SET
A vásárló számlázási címe.
Customer.Addresses.Invoice.Name   string GET SET
A számlázási címhez tartozó név.
Customer.Addresses.Invoice.ZIP   string GET SET
A számlázási címhez tartozó irányító szám.
Customer.Addresses.Invoice.City   string GET SET
A számlázási címhez tartozó város.
Customer.Addresses.Invoice.Street   string GET SET
A pontos számlázási cím.
Customer.Addresses.Invoice.StreetName   string GET SET
A számlázási címhez tartozó közterület neve.
Customer.Addresses.Invoice.StreetType   string GET SET
A számlázási címhez tartozó közterület jellege.
Customer.Addresses.Invoice.StreetNumber   string GET SET
A számlázási címhez tartozó házszám, emelet ajtó stb.
Customer.Addresses.Invoice.County   string GET SET
A számlázási címhez tartozó megye.
Customer.Addresses.Invoice.Country   string GET SET
A számlázási címhez tartozó ország.
Customer.Addresses.Invoice.CountryCode   string GET SET
A számlázási címhez tartozó országkód.
Customer.Addresses.Invoice.TaxNumber   string GET SET
A vásárló adószáma.
Customer.Addresses.Invoice.EUTaxNumber   string GET SET
A vásárló EU adószáma.
Customer.Addresses.Invoice.CustomerType   enum GET SET
A vásárló típusa.
Használható értékek
private Magánszemély
company Cég
other_customer_without_tax_number Egyéb, adószámmal nem rendelkező vásárló - használata áruházi beállítástól is függ!
Customer.Addresses.Shipping   object GET SET
A vásárló szállítási címe.
Customer.Addresses.Shipping.Name   string GET SET
A szállítási címhez tartozó név.
Customer.Addresses.Shipping.ZIP   string GET SET
A szállítási címhez tartozó irányítószám.
Customer.Addresses.Shipping.City   string GET SET
A szállítási címhez tartozó város.
Customer.Addresses.Shipping.Street   string GET SET
A pontos szállítási cím.
Customer.Addresses.Shipping.StreetName   string GET SET
Szállítási címhez tartozó közterület neve.
Customer.Addresses.Shipping.StreetType   string GET SET
Szállítási címhez tartozó közterület jellege.
Customer.Addresses.Shipping.StreetNumber   string GET SET
Szállítási címhez tartozó házszám, emelet, ajtó.
Customer.Addresses.Shipping.County   string GET SET
A szállítási címhez tartozó megye.
Customer.Addresses.Shipping.Country   string GET SET
A szállítási címhez tartozó ország.
Customer.Addresses.Shipping.CountryCode   string GET SET
A szállítási címhez tartozó ország kódja.
Customer.Addresses.Shipping.DeliveryPointID   string GET SET
Átvételi pontra szállításkor az átvételi pont azonosítója.
Customer.Addresses.Shipping.AltDeliveryPointID   string GET
Átvételi pontra szállítás esetén ha a szállító cég további azonosítót is kezel, annak értéke látható itt.
Customer.Addresses.Shipping.DeliveryPointGroup   string GET SET
Átvételi pontra szállításkor az átvételi pont csoport azonosítója.
Customer.Addresses.Shipping.DeliveryPointSubGroup   string GET SET
Átvételi pont csoport típusa (posta, postapont, csomagautomata), csak a DeliveryPointGroup megadásával együtt használható.
Customer.Addresses.Shipping.RecipientName   string GET SET
Átvételi pontra szállításkor az átvevő neve.
Customer.Group   object GET SET
A vásárlóhoz tartozó csoport adatai.
Customer.Group.Id   integer GET SET
A vásárló csoport egyedi azonosítója.
Customer.Group.Name   string GET SET
A vásárló csoport neve.
Customer.Group.ForeignID   integer GET
Vásárló csoport külső azonosítója.
Customer.Params   object GET SET
A vásárló által a regisztrációkor kitöltött vásárló paraméterek.
Customer.Params.Param   object GET SET
Egy vásárló paraméter.
Customer.Params.Param.Id   object GET SET
A vásárló paraméter azonosítója.
Customer.Params.Param.Name   string GET SET
A vásárló paraméter neve.
Customer.Params.Param.Value   string GET SET
A vásárló paraméter értéke.
Items   object GET SET
A rendelt tételek.
Items.Item   object GET SET
Egy rendelés tétel.
Items.Item.Id   string GET SET
A megrendelt termék egyedi azonosítója.
Items.Item.Sku   string GET SET
A megrendelt termék cikkszáma.
Items.Item.Name   string GET SET
A megrendelt termék neve.
Items.Item.Variants.Variant   object GET SET
Választható tulajdonság.
Items.Item.Variants.Variant.Id   integer GET SET
A választható tulajdonság sorszáma.
Items.Item.Variants.Variant.Name   string GET SET
A választható tulajdonság neve.
Items.Item.Variants.Variant.Value   string GET SET
A választható tulajdonság értéke.
Items.Item.ProductParams   object GET
A termékhez tartozó termék paraméterek.
Items.Item.ProductParams.ProductParam   object GET
Egy termék paraméter.
Items.Item.ProductParams.ProductParam.Id   integer GET
A termék paraméter egyedi azonosítója.
Items.Item.ProductParams.ProductParam.Name   string GET
A termék paraméter neve.
Items.Item.ProductParams.ProductParam.Value   string GET
A termék paraméter értéke.
Items.Item.ProductParams.ProductParam.Url   string GET
Vásárló által feltölthető fájl paraméter esetén a feltöltött fájl URL-je.
Items.Item.Data   object GET
A megrendelt termék egyéb adatai, tulajdonságai.
Items.Item.Data.Subscription   string GET
A megrendelt termék előfizetéssel került-e a rendelésbe vagy sem.
Items.Item.Unit   string GET SET
A megrendelt termék mennyiségi egysége.
Items.Item.Quantity   float GET SET
A megrendelt termék mennyisége.
Items.Item.PriceNet   float GET SET
A megrendelt termék nettó ára.
Items.Item.PriceGross   float GET SET
A megrendelt termék bruttó ára.
Items.Item.Vat   string GET
A megrendelt termék áfa kulcsa (pl. 27%).
Items.Item.Status   string GET SET
A rendelési tétel státusza.
Items.Item.PlusStatuses   object GET SET
További tétel státuszok.
Items.Item.PlusStatuses.Status   object GET SET
Egy további tétel státusz.
Items.Item.PlusStatuses.Status.Id   integer GET SET
A további tétel státusz egyedi azonosítója.
Items.Item.PlusStatuses.Status.Name   integer GET SET
A további tétel státusz neve.
Items.Item.PlusStatuses.Status.Value   string GET SET
A további tétel státusz értéke.
Items.Item.PlusStatuses.Status.Public   enum GET SET
A vásárló láthatja-e a további tétel státuszt.
Használható értékek
yes no
Items.Item.Control   object GET SET
Tétel ellenőrzés.
Items.Item.Control.Quantity   float GET SET
Ellenőrzött mennyiség.
Items.Item.Control.User   string GET SET
Az ellenőrzést végző felhasználó.
Items.Item.StockConsumptions   object GET
Megrendelés leadásakor melyik raktárakról milyen mennyiségben fogyasztottunk.
Items.Item.StockConsumptions.StockConsumption   object GET
Egy raktár fogyasztást leíró node.
Items.Item.StockConsumptions.StockConsumption.Id   string GET
A raktár egyedi azonosítója. Főraktár esetében main_stock lesz a node értéke.
Items.Item.StockConsumptions.StockConsumption.Name   string GET
A raktár neve. Főraktár esetében Main stock lesz a node értéke.
Items.Item.StockConsumptions.StockConsumption.Quantity   float GET
A raktárról fogyasztott mennyiség.
Currency   string GET SET
A megrendelés pénznem kódja.
PriceRounding   string GET
A megrendelés pénzneméhez kapcsolódó kerekítés során használt tizedesjegyek száma. A kerekítés csak a megjelenítéskor történik, számításkor mindíg a pontos értékekkel számolunk.
ExchangeValue   string GET SET
Megrendelés során érvényre jutott árfolyam szorzó, csak az alappénznemtől eltérő pénznem esetén értelmezett. A setOrder végpontnál csak új megrendelés rögzítésekor használható.
VatCountryCode   string GET SET
Megrendelésben használt áfához kapcsolódó ország (elsősorban OSS-hez). A setOrder végpontnál csak új megrendelés rögzítésekor használható.
Type   string GET SET
A megrendelés típusa.
Status   string GET SET
A megrendelés státusza - setOrder végpont használata esetén ez lehet a státusz neve vagy ID-ja is.
StatusDetails   string GET SET
A megrendelés státusz részletei.
StatusDateMod   string GET
A megrendelés státusz utolsó módosításának időpontja.
StatusEmail   string SET
Beállítható a mező segítségével, hogy küldjön-e a rendszer státusz e-mailt. Csak setOrder végpontnál használható.
Lehetséges értékek
yes no
OrderEmail   string SET
Beállítható a mező segítségével, hogy az eredeti rendelés értesítő emailt kiküldje-e a rendszer a vásárló számára. Csak setOrder végpontnál használható.
Lehetséges értékek
yes no
StatusID   string GET
A megrendelés státusz egyedi azonosítója.
Authenticated   string GET
A megrendelést visszaigazolta-e a vásárló. Ha nem kötelező visszaigazolni a megrendelést, úgy mindig yes érték szerepel ebben a mezőben.
Lehetséges értékek
yes no
Payment   object GET SET
A vásárló által választott fizetési mód.
Payment.Id   integer GET SET
A fizetési mód egyedi azonosítója.
Payment.Name   integer GET SET
A fizetési mód egyedi neve.
Payment.Type   enum GET
A fizetési mód típusa.
Használható értékek
cod Utánvét
cash Készpénz
coupon Kupon
credit Hitel
check Csekk
bankcard Bankkártya
bankcard_offline Bankkártya
other Egyéb
popup Bankkártya
transfer Átutalás
voucher Utalvány
bnpl Halasztott fizetés (Buy Now Pay Later)
qvik Qvik (QR kód, link)
bankcard_qvik Bankkártya vagy qvik
Payment.Status   enum GET
A fizetés státusza.
Használható értékek
unpaid Kifizetésre vár
paid Fizetett
partly paid Részben fizetett
overpaid Túlfizetés
Payment.Paid   float GET
A fizetett összeg.
Payment.Pending   float GET
Függőben lévő összeg.
Payment.Unpaid   float GET
Fizetetlen összeg.
Payment.Transactions   object GET
A speciális fizetési módokhoz tartozó tranzakciókat tartalmazó mező.
Payment.Transactions.Transaction   object GET
Egy tranzakció adatait tartalmazó mező.
Payment.Transactions.Transaction.Id   string GET SET
A tranzakció egyedi azonosítója. Manuális tranzakció rögzítésekor a mező értéke manual.
Payment.Transactions.Transaction.AuthCode   integer GET
A tranzakció engedély száma.
Payment.Transactions.Transaction.Status   enum GET
A tranzakció státusza.
Lehetséges értékek
start Fizetés indításra vár
redirect Átirányítva a fizetési oldalra
finish A tranzakció lezárult
pending Fizetés függőben
fault Fizetési hiba
Payment.Transactions.Transaction.Date   integer GET SET
A tranzakció dátuma. A setOrder végpontnál akkor használható, ha a tranzakció azonosító értéke manual
Payment.Transactions.Transaction.Amount   double GET SET
A tranzakció összege. A setOrder végpontnál akkor használható, ha a tranzakció azonosító értéke manual
Payment.Transactions.Transaction.AmountRefund   double GET
Visszatérített összeg.
Payment.ForeignID   string GET
A tranzakció külső azonosítója. Nem minden esetben áll rendelkezésre.
Shipping   object GET SET
A vásárló által választott szállítási mód.
Shipping.Id   integer GET SET
A szállítási mód egyedi azonosítója.
Shipping.Name   string GET SET
A szállítási mód neve.
Shipping.PackageNumber   string GET SET
Csomagazonosító.
Shipping.TrackingUrl   string GET SET
Csomaghoz tartozó nyomkövetési URL linkje.
Shipping.ForeignID   integer GET SET
A szállítási mód külső azonosítója.
Invoice   object GET SET
A számlázással kapcsolatos adatok.
Invoice.Status   enum GET SET
A számlázás állapota.
Használható értékek
0 Nem számlázható
1 Számlázható
2 Számlázva
Invoice.StatusText   string GET
A számlázás állapota szövegesen.
Invoice.Number   string GET SET
A számla sorszáma.
Invoice.Url   string GET SET
A számla közvetlen URL-je.
Storno   object GET SET
Stornó számlához tartozó adatok.
Storno.Number   string GET SET
A stornó számla sorszáma.
Storno.Url   string GET SET
A stornó számla közvetlen URL-je.
Params   object GET SET
Megrendelés paramétereket leíró mező.
Params.Param   object GET SET
Egy megrendelés paramétert leíró mező.
Params.Param.Id   integer GET SET
A megrendelés paraméter egyedi azonosítója.
Params.Param.Name   string GET SET
A megrendelés paraméter neve.
Params.Param.Value   string GET SET
A megrendelés paraméter értéke.
Referer   string GET SET
A vásárló erről az oldalról érkezett a webáruház vásárló felületére.
Affiliate   object GET
A rendeléshez tartozó partnerprogram adatok.
Affiliate.Id   string GET
A partnerprogram azonosítója.
Affiliate.Name   string GET
A partnerprogram neve.
UTM   string GET
UTM adatok
UTM.Source   string GET
utm_source
UTM.Medium   string GET
utm_medium
UTM.Campaign   string GET
utm_campaign
UTM.Content   string GET
utm_content
Coupon   string GET SET
A vásárló által felhasznált kupon kódja. A setOrder használat esetén csak új megrendelés leadásakor állítható be.
Weight   float GET
A megrendelés össztömege kilogrammban. A termékek és a csomagolás tömege alapján kalkulált érték.
Info   object GET
A megrendeléssel kapcsolatos egyéb információk.
Info.MergedFrom   object GET
Amennyiben összevont megrendelésről van szó, itt jelennek meg a különböző forrás rendelések azonosítói.
Info.MergedFrom.Key   string GET
Egy forrás megrendelés egyedi azonosítója.
Info.SeparatedTo   object GET
Amennyiben szétbontott megrendelésről van szó, itt jelennek meg a különböző cél rendelések azonosítói.
Info.SeparatedTo.Key   string GET
Egy cél megrendelés egyedi azonosítója
Info.SeparatedFrom   object GET
Szétbontott rendelések esetén, ha az aktuális rendelés egy cél rendelés, itt jelenik meg az eredeti forrás rendelés.
Info.SeparatedFrom.Key   string GET
Az adott megrendelést ebből a forrás megrendelésből bontotta szét az adminisztrátor.
Info.CopiedFrom   object GET
Amennyiben másolt megrendelésről van szó, itt jelenik meg a forrás rendelés azonosítója.
Info.CopiedFrom.Key   string GET
A forrás megrendelés egyedi azonosítója.
Info.ReturnedFrom   object GET
Amennyiben az adott rendelés egy visszáru megrendelésről, itt jelenik meg a visszaküldött rendelés azonosítója.
Info.ReturnedFrom.Key   string GET
A visszaküldött megrendelés egyedi azonosítója.
Info.ReturnedTo   object GET
Amennyiben az adott megrendelést visszaküldték, itt jelenik meg a visszáru rendelés azonosítója.
Info.ReturnedTo.Key   string GET
A visszáru megrendelés egyedi azonosítója.
Comments   object GET SET
A megrendeléshez tartozó megjegyzések.
Comments.Comment   object GET SET
Egy megjegyzést leíró mező.
Comments.Comment.Type   enum GET SET
A megjegyzés típusa.
Használható értékek
customer Normál vásárlói megjegyzés
customer_shipping Vásárló által a szállítónak átadott megjegyzés
admin Adminisztrátori megjegyzés (vásárló nem látja)
Comments.Comment.Text   string GET SET
A megjegyzés szövege.
SumPriceGross   float GET
A megrendelés bruttó végösszege.
Példák
Rendelések lekérése
Az első példában egy getOrder kérést és az arra kapott választ láthatod. Jelen esetben egy meghatározott időszakban leadott, számlázható megrendelések kerülnek lekérdezésre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <InvoiceStatus>1</InvoiceStatus>
    <DateStart>2022.03.01</DateStart> 
    <DateEnd>2022.03.05</DateEnd> 
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Orders> 
	<Order> 
	    <Action>modify</Action>  
		<Key>1000-1000000</Key> 
		<Date>2012.01.01 10:00:00</Date> 
		<DateMod>2012.02.01 10:00:00</DateMod> 
		<Lang>hu</Lang> 
		<Customer> 
			<Id>100000</Id> 
			<Email>unas@unas.hu</Email> 
			<Username></Username> 
			<Contact> 
				<Name><![CDATA[Kis János]]></Name> 
				<Phone><![CDATA[+3699111111]]></Phone> 
				<Mobile><![CDATA[+36301111111]]></Mobile> 
			</Contact>
			<Addresses> 
				<Invoice> 
					<Name><![CDATA[Teszt János]]></Name> 
					<ZIP>1111</ZIP> 
					<City><![CDATA[Teszt Város]]></City> 
					<Street><![CDATA[Tej út 2.]]></Street> 
					<StreetName><![CDATA[Tej]]></StreetName> 
					<StreetType><![CDATA[út]]></StreetType> 
					<StreetNumber><![CDATA[2]]></StreetNumber> 
					<County><![CDATA[]]></County> 
					<Country>Magyarország</Country> 
					<CountryCode>hu</CountryCode> 
					<TaxNumber><![CDATA[12345678-9-00]]></TaxNumber> 
					<EUTaxNumber><![CDATA[HU0123456789]]></EUTaxNumber> 
					<CustomerType><![CDATA[private]]></CustomerType> 
				</Invoice>
				<Shipping> 
					<Name><![CDATA[Teszt János]]></Name> 
					<ZIP>2222</ZIP> 
					<City><![CDATA[Teszt Város]]></City> 
					<Street><![CDATA[Tej út 10.]]></Street> 
					<StreetName><![CDATA[Tej]]></StreetName> 
					<StreetType><![CDATA[út]]></StreetType> 
					<StreetNumber><![CDATA[10]]></StreetNumber> 
					<County><![CDATA[]]></County> 
					<Country>Magyarország</Country> 
					<CountryCode>hu</CountryCode> 
					<DeliveryPointID>157547</DeliveryPointID> 
					<DeliveryPointGroup>gls_api_dropoffpoints</DeliveryPointGroup> 
					<DeliveryPointSubGroup>csomagautomata</DeliveryPointSubGroup> 
					<RecipientName>Teszt János</RecipientName> 
				</Shipping>
			</Addresses>
			<Group> 
				<Id>1234</Id> 
				<Name><![CDATA[Törzsvásárló]]></Name> 
				<ForeignID><![CDATA[12345]]></ForeignID> 
			</Group>
			<Params> 
				<Param> 
					<Id>1000</Id> 
					<Name><![CDATA[Kérdés1]]></Name> 
					<Value><![CDATA[Válasz1]]></Value> 
				</Param>
				<Param> 
					<Id>2000</Id>
					<Name><![CDATA[Kérdés2]]></Name>
					<Value><![CDATA[Válasz2]]></Value>
				</Param>
			</Params>
			<Comment><![CDATA[Megjegyzés]]></Comment> 		
		</Customer>
		<Currency>HUF</Currency> 
		<ExchangeValue>0.00290922</ExchangeValue> 
		<Type><![CDATA[Garanciális]]></Type> 
		<Status><![CDATA[Beérkezett]]></Status> 
		<StatusDetails><![CDATA[---]]></StatusDetails> 
		<StatusDateMod>2012.02.01 10:00:00</StatusDateMod> 
		<StatusEmail>no</StatusEmail> 
		<StatusID>123456</StatusID> 
		<Authenticated>yes</Authenticated> 
		<Payment> 
			<Id>100</Id> 
			<Name><![CDATA[Utalás]]></Name> 
			<Type>transfer</Type> 
			<Status>paid</Status> 
			<Paid>1000</Paid> 
			<Pending>500</Pending> 
			<Transactions> 
				<Transaction>
					<Id>1234</Id> 
					<AuthCode>4321</AuthCode> 
					<Status>finish</Status> 
					<Date>2017.02.02 11:22:01</Date> 
					<Amount>1000</Amount> 
				</Transaction>
				<Transaction>
					<Id>manual</Id> 
					<Status>finish</Status>
					<Date>2017.02.02 11:22:01</Date> 
					<Amount>1000</Amount> 
				</Transaction>
			</Transactions>
			<ForeignID><![CDATA[123456]]></ForeignID> 
		</Payment>
		<Shipping> 
			<Id>200</Id> 
			<Name><![CDATA[Futárszolgálat]]></Name> 
			<PackageNumber><![CDATA[PUDO123456789]]></PackageNumber> 
			<ForeignID><![CDATA[654321]]></ForeignID> 
		</Shipping>
		<Invoice> 
			<Status>1</Status> 
			<StatusText><![CDATA[Számlázható]]></StatusText> 
			<Number><![CDATA[UO-1000/2012]]></Number> 
			<Url><![CDATA[http://unas.hu/szamla.pdf]]></Url> 
		</Invoice>
		<Params> 
			<Param> 
				<Id>1000</Id> 
				<Name><![CDATA[Kérdés1]]></Name> 
				<Value><![CDATA[Válasz1]]></Value> 
			</Param>
			<Param> 
				<Id>2000</Id>
				<Name><![CDATA[Kérdés2]]></Name>
				<Value><![CDATA[Válasz2]]></Value>
			</Param>
		</Params>
		<Referer><![CDATA[shop.unas.hu]]></Referer> 
		<Coupon><![CDATA[f6zhr48jd]]></Coupon> 
		<Weight>10.5</Weight> 
		<Info> 
		    <MergedFrom> 
                <Key>1000-100233</Key>
                <Key>1000-100234</Key>
                <Key>1000-100235</Key>
            </MergedFrom>
            <SeparatedTo> 
                <Key>1000-100230</Key>
                <Key>1000-100231</Key>
            </SeparatedTo>
            <SeparatedFrom> 
                <Key>1000-100230</Key>                
            </SeparatedFrom>
		</Info>
		<Comments> 
			<Comment> 
				<Type>customer</Type> 
				<Text><![CDATA[A vásárló megjegyzése]]></Text> 
			</Comment>
			<Comment> 
				<Type>customer_shipping</Type> 
				<Text><![CDATA[A vásárló megjegyzése a szállító számára]]></Text> 
			</Comment>
			<Comment> 
				<Type>admin</Type> 
				<Text><![CDATA[Az adminisztrátor megjegyzése, a vásárló nem látja]]></Text> 
			</Comment>
		</Comments>
		<SumPriceGross>7620</SumPriceGross> 
		<Items> 
			<Item> 
				<Id>1000</Id> 
				<Sku>Cikkszam1</Sku> 
				<Name><![CDATA[Termék név 1]]></Name> 
				<Unit>db</Unit> 
				<Quantity>1</Quantity> 
				<PriceNet>1000</PriceNet> 
				<PriceGross>1270</PriceGross> 
				<Vat>27%</Vat> 
				<Status><![CDATA[Holnap érkezik]]></Status> 
				<PlusStatuses> 
				    <Status> 
				        <Id>123</Name> 
				        <Name><![CDATA[Név]]></Name> 
				        <Value><![CDATA[Érték]]></Value> 
				        <Public>yes</Public> 
				    </Status>
				</PlusStatuses>
				<Control> 
				    <Quantity>5</Quantity> 
				    <User>abc123</User> 
				</Control>
			</Item>
			<Item> 
				<Id>2000</Id>
				<Sku>Cikkszam2</Sku>
				<Name><![CDATA[Termék név 2]]></Name>
				<Variants> 
					<Variant> 
						<Id>1</Id> 
						<Name><![CDATA[Szín]]></Name> 
						<Value><![CDATA[Piros]]></Value> 
					</Variant>
					<Variant> 
						<Id>2</Id>
						<Name><![CDATA[Méret]]></Name>
						<Value><![CDATA[XL]]></Value>
					</Variant>
				</Variants>
				<ProductParams> 
					<ProductParam> 
						<Id>17</Id> 
						<Name><![CDATA[Paraméter név]]></Name> 
						<Value><![CDATA[Megadott érték]]></Value> 
					</ProductParam>
				</ProductParams>
				<Unit>db</Unit>
				<Quantity>1</Quantity>
				<PriceNet>2000</PriceNet>
				<PriceGross>2540</PriceGross>
				<Vat>27%</Vat>
			</Item>
			<Item> 
				<Id>2000</Id>
				<Sku>Cikkszam2</Sku>
				<Name><![CDATA[Termék név 2]]></Name>
				<Variants>
					<Variant>
						<Id>1</Id>
						<Name><![CDATA[Szín]]></Name>
						<Value><![CDATA[Kék]]></Value>
					</Variant>
					<Variant>
						<Id>2</Id>
						<Name><![CDATA[Méret]]></Name>
						<Value><![CDATA[XXL]]></Value>
					</Variant>
				</Variants>
				<Unit>db</Unit>
				<Quantity>1</Quantity>
				<PriceNet>3000</PriceNet>
				<PriceGross>3810</PriceGross>
				<Vat>27%</Vat>
			</Item>
			<Item> 
				<Id>discount-percent</Id> 
				<Sku>discount-percent</Sku> 
				<Name><![CDATA[Kedvezmény (10%)]]></Name> 
				<Unit>db</Unit>
				<Quantity>1</Quantity>
				<Percent>10</Percent> 
				<PriceNet>-1000</PriceNet>
				<PriceGross>-1270</PriceGross>
				<Vat>27%</Vat>
			</Item>
			<Item> 
				<Id>shipping-cost</Id> 
				<Sku>shipping-cost</Sku> 
				<Name><![CDATA[Szállítási költség]]></Name>
				<Unit>db</Unit>
				<Quantity>1</Quantity>
				<PriceNet>1000</PriceNet>
				<PriceGross>1270</PriceGross> 
				<Vat>27%</Vat>
			</Item>
			<Item> 
				<Id>discount-amount</Id> 
				<Sku>discount-amount</Sku> 
				<Name><![CDATA[Kedvezmény (összegszerű)]]></Name>
				<Unit>db</Unit>
				<Quantity>1</Quantity>
				<PriceNet>-100</PriceNet>
				<PriceGross>-127</PriceGross> 
				<Vat>27%</Vat>
			</Item>
			<Item> 
				<Id>handel-cost</Id> 
				<Sku>handel-cost</Sku> 
				<Name><![CDATA[Fizetéssel kapcsolatos kezelési költség]]></Name>
				<Unit>db</Unit>
				<Quantity>1</Quantity>
				<PriceNet>100</PriceNet>
				<PriceGross>127</PriceGross> 
				<Vat>27%</Vat>
			</Item>
		</Items>
	</Order>	
</Orders>


Rendelések módosítása
A második példában egy setOrder kérést láthatsz, ilyen módon tudsz meglévő rendelést módosítani vagy új rendelést rögzíteni, itt ez utóbbira láthatsz konkrét példát.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Orders> 
	<Order> 
	    <Action>add</Action>  		
		<Date>2022.03.12 10:00:00</Date>		
		<Lang>hu</Lang> 
		<Customer>
			<Id>100000</Id> 
			<Email>unas@unas.hu</Email> 
			<Username></Username> 
			<Contact> 
				<Name><![CDATA[Kis János]]></Name> 
				<Phone><![CDATA[+3699111111]]></Phone> 
				<Mobile><![CDATA[+36301111111]]></Mobile> 
			</Contact>
			<Addresses> 
				<Invoice> 
					<Name><![CDATA[Teszt János]]></Name> 
					<ZIP>1111</ZIP> 
					<City><![CDATA[Teszt Város]]></City> 
					<Street><![CDATA[Tej út 2.]]></Street> 
					<StreetName><![CDATA[Tej]]></StreetName> 
					<StreetType><![CDATA[út]]></StreetType> 
					<StreetNumber><![CDATA[2]]></StreetNumber> 
					<County><![CDATA[]]></County> 
					<Country>Magyarország</Country> 
					<CountryCode>hu</CountryCode> 
					<TaxNumber><![CDATA[12345678-9-00]]></TaxNumber> 
					<EUTaxNumber><![CDATA[HU0123456789]]></EUTaxNumber> 
					<CustomerType><![CDATA[private]]></CustomerType> 
				</Invoice>
				<Shipping> 
					<Name><![CDATA[Teszt János]]></Name> 
					<ZIP>2222</ZIP> 
					<City><![CDATA[Teszt Város]]></City> 
					<Street><![CDATA[Tej út 10.]]></Street> 
					<StreetName><![CDATA[Tej]]></StreetName> 
					<StreetType><![CDATA[út]]></StreetType> 
					<StreetNumber><![CDATA[10]]></StreetNumber> 
					<County><![CDATA[]]></County> 
					<Country>Magyarország</Country> 
					<CountryCode>hu</CountryCode> 
					<DeliveryPointID>157547</DeliveryPointID> 
					<DeliveryPointGroup>gls_api_dropoffpoints</DeliveryPointGroup> 
					<DeliveryPointSubGroup>csomagautomata</DeliveryPointSubGroup> 
					<RecipientName>Teszt János</RecipientName> 
				</Shipping>
			</Addresses>			
			<Comment><![CDATA[Megjegyzés]]></Comment> 		
		</Customer>
		<Currency>HUF</Currency> 		
		<Payment> 
			<Id>100</Id> 
			<Name><![CDATA[Utalás]]></Name> 
			<Type>transfer</Type>			
		</Payment>
		<Shipping> 
			<Id>200</Id> 
			<Name><![CDATA[Futárszolgálat]]></Name> 
			<PackageNumber><![CDATA[PUDO123456789]]></PackageNumber>			
		</Shipping>
		<Invoice> 
			<Status>1</Status> 
			<StatusText><![CDATA[Számlázható]]></StatusText> 			
		</Invoice>
		<Params> 
			<Param> 
				<Id>1000</Id> 
				<Name><![CDATA[Kérdés1]]></Name> 
				<Value><![CDATA[Válasz1]]></Value> 
			</Param>
			<Param> 
				<Id>2000</Id>
				<Name><![CDATA[Kérdés2]]></Name>
				<Value><![CDATA[Válasz2]]></Value>
			</Param>
		</Params>		
		<Coupon><![CDATA[f6zhr48jd]]></Coupon> 
		<Weight>10.5</Weight>		
		<Comments> 
			<Comment>
				<Type>customer</Type> 
				<Text><![CDATA[A vásárló megjegyzése]]></Text> 
			</Comment>
		</Comments>
		<SumPriceGross>12700</SumPriceGross> 
		<Items> 
			<Item> 
				<Id>1000</Id> 
				<Sku>Cikkszam1</Sku> 
				<Name><![CDATA[Termék név 1]]></Name> 
				<Unit>db</Unit> 
				<Quantity>10</Quantity> 
				<PriceNet>1000</PriceNet> 
				<PriceGross>1270</PriceGross> 
				<Vat>27%</Vat> 
				<Status><![CDATA[Holnap érkezik]]></Status>				
			</Item>			
		</Items>
	</Order>	
</Orders>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Orders>
	<Order>
		<Action>add</Action>
		<Key>250988</Key>
		<Status>ok</Status>
	</Order>
</Orders>
Raktárkészlet
Az áruházban az egyes termékekhez rögzített, azoknál kezelt készlet információt tudod az API ezen végpontjain keresztül módosítani illetve lekérni. Tudsz új készlet bejegyzést rögzíteni, meglévőt módosítani, valamint információt lekérni az aktuális állapotról.
getStock
Az alábbi végpont visszaadja a kérésében meghatározott feltételeknek megfelelő raktárkészlet adatokat.
Végpont: https://api.unas.eu/shop/getStock
A getStock kérésben láthatod, hogy milyen módon lehet a készletinformációkat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy termék lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több termék lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setStock
A setStock végpont segítségével különböző készlet információ változásokat szúrhatsz be a webáruházadhoz, valamint meglévő készlet bejegyzéseket tudsz módosítani.
Végpont: https://api.unas.eu/shop/setStock
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setStock kérést, melynek a válaszát a setStock válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 terméket tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 terméket tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getStock kérés
GET kérésben határozhatod meg, milyen feltételek alapján szeretnéd a raktárkészlet információkat lekérni. A GET kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
A termék egyedi azonosítója. Ha ezt használod, akkor az Sku értéket figyelmen kívül hagyjuk.
Sku   string
A termék cikkszáma. Vesszővel elválasztva több cikkszám is megadható, így több termék is lekérdezhető.
Variant1, Variant2, Variant3   string
Meghatározhatod, hogy a termék közös raktárkészletét szeretnéd-e visszakapni a getStock válaszban vagy ha változatonként kezeled a raktárkészletet, akkor egy konkrét változat kombináció készletét kérdezheted le.
LimitNum   integer
Ha nem az összes termék raktárkészletét szeretnéd letölteni, akkor ebben a mezőben meghatározhatod, hogy mennyi termék készlete kerüljön letöltésre.
LimitStart   integer
Ha nem az összes termék raktárkészletét szeretnéd letölteni, akkor ebben a mezőben meghatározhatod, hányadik terméktől induljon a raktárkészlet lekérés. Pozitív egész számot várunk, csak a LimitNum paraméterrel együtt használható.
TimeStart   unix timestamp
A mezőben meghatározott időbélyeg után bekövetkezett készletmozgások jelennek meg a válaszban. Fontos, hogy csak azon termékek szerepelnek a válaszban, melyeknél volt készletmozgás az adott időszakban!
getStock válasz
A getStock kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setStock kérés
A setStock kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setStock válasz
A setStock válaszban láthatod a műveletnek megfelelő információkat, az egyes elemekről bővebben alább találsz információt.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbiak egyike lehet.
in Betesz
out Kivesz
modify Összmennyiség módosítása
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A raktárkészlet kezeléshez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getStock kérésre a választ, illetve ilyen formában kell beküldened a setStock kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük, hogy melyik adattag használható a getStock illetve setStock végpontokhoz a GET illetve SET jelölések mentén.
Action   enum SET
A raktár műveletet leíró mező.
Használható értékek
in Betesz
out Kivesz
modify Összmennyiség módosítása
Id   integer GET SET
A termék egyedi azonosítója.
Sku   string GET SET
A termék cikkszáma.
Stocks   object GET SET
A termékhez tartozó raktárkészlet adatok.
Stocks.Stock   object GET SET
Egy raktárkészletet leíró mező.
Stocks.Stock.WarehouseId   integer GET SET
További raktár azonosítója. A getStock kérésben egy további raktár készletéről kaphatsz információt. A setStock kérésben azonosítja a további raktárat.
Stocks.Stock.IsActive   enum GET SET
További raktárak kapcsán a készlet fogyaszthatóságát ellenőrizheted.
Használható értékek
yes
no
Stocks.Stock.Qty   float GET SET
Raktáron lévő mennyiség.
Stocks.Stock.Price   float GET SET
Készletrögzítés során alkalmazott beszerzési ár.
Stocks.Stock.Comment   string SET
A raktárkészlet változáshoz megadható plusz információ, megjegyzés, így értelemszerűen csak setStock végpontnál használható.
Stocks.Stock.Variants   object GET SET
Ha a termékhez változatonkénti raktárkészlet kezelést használsz, akkor megjelenik a válaszban, hogy melyik változatkombinációhoz tartozik a raktáron lévő mennyiség. Ez a mező a változat kombinációkat tartalmazza.
Stocks.Stock.Variants.Variant   string GET SET
A változat kombinációk közül egy változat érték.

Az alábbi példa egy három változattal rendelkező termék készlet kezelését mutatja be, mely egy S méretű, kék színű, pamut anyagú pulóver 10 darab készleten levő mennyiséggel.
...
<Stocks>
	<Stock>
		<Variants>
			<Variant><![CDATA[Kék]]></Variant>
			<Variant><![CDATA[S]]></Variant>
			<Variant><![CDATA[Pamut]]></Variant>
		</Variants>
		<Qty>10</Qty>
	</Stock>
</Stocks>
...
Példák
Normál készlet lekérés
Az alábbi getStock kérésben a product_1 cikkszámú termék raktárkészletét kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Sku>product_1</Sku>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>159850145</Id>
		<Sku>product_1</Sku>
		<Stocks>
			<Stock>
				<Qty>3</Qty>
			</Stock>
		</Stocks>
	</Product>
</Products>


Változathoz kötött készlet lekérés
Ha egy változat kombinációnak a raktárkészletét szeretnéd lekérni, az alábbi getStock kéréssel teheted meg.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Sku>product_2</Sku>
    <Variant1>Kék</Variant1>
	<Variant2>XL</Variant2>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>159850146</Id>
		<Sku>product_2</Sku>
		<Stocks>
			<Stock>
				<Qty>5</Qty>
			</Stock>
		</Stocks>
	</Product>
</Products>


Betesz/kivesz funkció
Az alábbi példában azt mutatjuk be, hogyan tudod a betesz illetve kivesz funkciókat használni az API setStock végpontjának segítségével.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Action>in</Action>
		<Sku>product_1</Sku>
		<Stocks>
			<Stock>
				<Qty>10</Qty>
				<Price>1000</Price>
				<Comment>Bevét:10 darabot 1000 Ft-os beszerzési áron.</Comment>
			</Stock>
		</Stocks>
	</Product>
	<Product>
		<Action>out</Action>
		<Sku>product_2</Sku>
		<Stocks>
			<Stock>
				<Variants>
					<Variant>Piros</Variant>
					<Variant>XL</Variant>
				</Variants>
				<Qty>5</Qty>
				<Comment>Kivét/eladás:  5 darab</Comment>
			</Stock>
			<Stock>			
				<Variants>
					<Variant>Kék</Variant>
					<Variant>XL</Variant>
				</Variants>
				<Qty>10</Qty>
				<Comment>Kivét/eladás: 10 darab</Comment>
			</Stock>
		</Stocks>
	</Product>
</Products>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>159850145</Id>
		<Sku>product_1</Sku>
		<Action>in</Action>
		<Status>ok</Status>
	</Product>
	<Product>
		<Id>159850146</Id>
		<Sku>product_2</Sku>
		<Action>out</Action>
		<Status>ok</Status>
	</Product>
</Products>


Készlet módosítás
Itt azt láthatod, hogy hogyan tudod módosítani az általad választott termék raktárkészletét. A példában látható kérés eredménye 10 darab készleten levő termék lesz.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Action>modify</Action>
		<Sku>product_1</Sku>
		<Stocks>
			<Stock>
				<Qty>10</Qty>
			</Stock>
		</Stocks>
	</Product>
</Products>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>159850145</Id>
		<Sku>product_1</Sku>
		<Action>modify</Action>
		<Status>ok</Status>
	</Product>
</Products>
Termékek
A termékek kezeléséhez használatos funkciókkal le tudod kérdezni a már létrehozott termékeket (getProduct), illetve módosítani, törölni vagy épp létrehozni tudsz termékeket (setProduct). Ebben a fejezetben bővebb információt kaphatsz a getProductDB illetve a setProductDB végpontok használatáról is. Ezen végpontok segítségével termék adatbázist tudsz fel- illetve letöltetni webáruházadból.
getProduct
A getProduct végponttal listázhatók az áruházban létrehozott termékek, a kérésben meghatározott feltételeknek megfelelően. Egy vagy több termék is lekérdezhető egy kéréssel.
Végpont: https://api.unas.eu/shop/getProduct
A getProduct kérésben láthatod, hogy milyen módon lehet a termékeket listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy termék lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több termék lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setProduct
A setProduct végpont használatával tudsz létrehozni, módosítani illetve törölni termékeket. Egy vagy több termék is módosítható egy kéréssel.
Végpont: https://api.unas.eu/shop/setProduct
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setProduct kérést, melynek válaszát a setProduct válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 terméket tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 terméket tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getProductDB
A kérésben meghatározott formátumban generálódik egy teljes termék adatbázis. A termék adatbázis felépítése megegyezik az adminisztrációs felületen a Termékek/Termék adatbázis menüben letölthető adatbázis felépítésével. Az adatbázis felépítésérről ITT olvashatsz. A funkció egy XML-lel tér vissza, amiben szerepel a generált termék adatbázis URL-je, ezt 1 órán belül kell letölteni, utána törlésre kerül.
Végpont: https://api.unas.eu/shop/getProductDB
PREMIUM 10 hívás / óra
VIP 20 hívás / óra
setProductDB
Az admin felületen a Termékek/Termék adatbázis menüben vagy a getProductDB funkcióval letöltött adatbázist lehet visszatölteni az áruházba, ennek segítségével a termékek szinte összes adata módosítható illetve új termékek is rögzíthetők. Az adatbázis felépítésérről ITT olvashatsz. A funkció egy XML-lel tér vissza, amiben az importtal kapcsolatos statisztikai adatok szerepelnek.
Végpont: https://api.unas.eu/shop/setProductDB
Hívásonként maximum 100kB (ZIP tömörítve 20kB) adatbázis méret esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
Hívásonként több, mint 100kB (ZIP tömörítve 20kB) adatbázis méret esetén:
PREMIUM 10 / óra
VIP 30 / óra
getProduct kérés
getProduct kérésben határozhatod meg, milyen feltételek alapján szeretnéd a termékeket lekérni. A getProduct kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
StatusBase   enum
A termékek státusza alapján tudod meghatározni a lekérni kívánt termékeket. Vesszővel elválasztva több érték is használható.
Használható értékek
0 Inaktív
1 Aktív
2 Aktív, Új
3 Aktív, nem vásárolható
State   enum
A termékek állapota alapján tudod meghatározni a lekérni kívánt termékeket.
Használható értékek
live Aktuálisan létező termékek
deleted Törölt termékek (egy hónapra visszamenőleg)
Id   integer
A termék egyedi azonosítója. Ha ezt a mezőt használod, akkor csak a kérésben használt azonosítóval rendelkező termék fog megjelenni a válaszban. Ha ezt a mezőt kitöltöd, akkor az Sku mezőt figyelmen kívül hagyjuk.
Sku   string
A termék cikkszáma. Ha ezt a mezőt használod, akkor csak kérésben használt cikkszámú termék fog megjelenni a válaszban. Vesszővel elválasztva több cikkszám is megadható, így több termék is lekérdezhető.
Parent   string
Ebbe a mezőbe egy termékösszevonás alap típusának cikkszámát adhatod meg. Az alaptípus alá tartozó összes altípus megjelenik a válaszban.
CategoryId   integer
Csak a mezőben meghatározott kategóriában szereplő termékek szerepelnek majd a válaszban. Alternatív kategóriákat nem kezel, tehát ténylegesen azon termékek jelennek meg a válaszban, melyek elsődleges kategóriája a beállított kategória. Vesszővel elválasztva több érték is használható.
TimeStart   unix timestamp
A mezőben meghatározott időbélyeg után módosított termékek kerülnek bele a válaszba.
TimeEnd   unix timestamp
A mezőben meghatározott időbélyeg előtt módosított termékek kerülnek a válaszba.
DateStart   date
A mezőben meghatározott dátum után módosított termékek kerülnek be a válaszba. Az elvárt dátum formátum YYYY.MM.DD.
DateEnd   date
A mezőben meghatározott dátum előtt módosított termékek kerülnek be a válaszba. Az elvárt dátum formátum YYYY.MM.DD.
ContentType   enum
Meghatározhatod, milyen adatok kerüljenek be a válaszba egy termékhez. Négy szint közül választhatsz.
Választható szintek
minimal Gyors adatlekérés, minimális adathalmazzal.
short Szűkített lista, bővített törzsadatokkal.
normal Normál lista, leggyakrabban használt törzsadatokkal, alapértelmezett típus.
full Teljes lista, minden termék adattal. Csak akkor érdemes használni, ha valóban szükséges.
ContentParam   enum
full lekérés esetén, vesszővel elválasztva termék paraméter azonosítókat adhatsz meg, így tudod szűkíteni a válaszban megjelenő termék paraméterek listáját.
LimitNum   integer
Ha nem az összes terméket szeretnéd letölteni, meghatározhatod ebben a mezőben a darabszámot.
LimitStart   integer
Ha nem az összes terméket szeretnéd letölteni, meghatározhatod, hogy hányadik terméktől kezdődjön a letöltés. Pozitív egész szám, a LimitNum paraméterrel együtt használható.
Lang   string
Meghatározhatod, hogy milyen nyelvű termék adatokat szeretnél letölteni. A nyelvet az ISO 639-1 szabvány szerinti két karakteres kóddal kell meghatározni (pl.: hu, en, de). Az adatszerkezet fejezetben külön badge jelöli a nyelvek szempontjából kezelt adatokat.
getProduct válasz
A getProduct kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setProduct kérés
A setProduct kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setProduct válasz
A setProduct válaszban láthatod az információkat a módosított, létrehozott illetve törölt termékekről. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le, mely az alábbi lehet.
add Hozzáadás
modify Módosítás
delete Törlés
Sku   integer
A termék cikkszáma.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A termékek kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getProduct kérésre a választ, illetve ilyen formában kell beküldened a setProduct kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük, hogy melyik adattag használható a getProduct illetve setProduct végpontoknál, GET illetve SET jelöléssel láttuk el ezeket a mezőket. LANG jelöléssel láttuk el azokat az adatokat a leírásban, amelyeknél a kérés során különböző nyelveken is alkalmazható a lekérdezés és a módosítás. A Lang adatot setProduct kérés esetén az egyes Product node-okon belül kell elhelyezni.
Az egyes mezőknél a magyarázat mellett az is látható, hogy a konkrét adat milyen tartalmi szinten érhető el: minimal, short, normal vagy full. Itt csak a minimális elérési szinteket jelöljük, azaz ha egy adat elérhető pl. short szinten, akkor ugyancsak szerepelni fog a válaszban normal és full esetén is. Ha egy konkrét adatnál nincs külön jelölés, akkor az már minimal szinten is elérhető.
A mandatory jelzéssel ellátott mezők megadása kötelező termék létrehozás esetén.
Action   enum SET
Az API híváshoz tartozó művelet. Csak setProduct végpontnál használható.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
State   enum GET
A termék állapota.
Lehetséges értékek
live Létező termék
deleted Törölt termék
Id   integer GET SET
A termék egyedi azonosítója. UNAS osztja ki a termékeknek a termék létrehozásakor!
Sku   string mandatory GET SET
A termék cikkszáma. Csak angol kis és nagy betűk, számok, valamint "-" és "_" karakter használható.
SkuNew   string SET
A termék új cikkszáma. Csak angol kis és nagy betűk, számok, valamint "-" és "_" karakter használható.
CreateTime   unix timestamp GET
A termék létrehozásának időpontja időbélyeg (Unix timestamp) formátumban.
LastModTime   unix timestamp GET
A termék utolsó módosításának időpontja időbélyeg (Unix timestamp) formátumban.
History   object short GET
Történet, egy hónapra visszamenőleg. A termékkel kapcsolatos eseményeket tartalmazó mező.
History.Event   object short GET
Egy múltbeli eseményt leíró mező.
History.Event.Action   enum short GET
Az esemény típusa.
Lehetséges értékek
add Létrehozás
modify Cikkszám módosítás
delete Törlés
History.Event.Time   unix timestamp short GET
Az esemény bekövetkezésének időpontja.
History.Event.Sku   string short GET
Az esemény bekövetkezésének időpontjában a termék cikkszáma.
History.Event.SkuOld   string short GET
Termék cikkszám módosításkor a termék régi cikkszáma.
Statuses   object GET SET
Termék státuszok.
Statuses.Status   object GET SET
Termék státuszát leíró mező. A terméknek lehet egy alap státusza és három plusz termék státusza.
Statuses.Status.Type   enum GET SET
A termék státusz típusa.
Használható értékek
base Alap termék státusz
plus Plusz termék státusz
Statuses.Status.Value   enum GET SET
A termék státusz értéke.
Használható értékek
Alap base státusz esetén a StatusBase mezőnél leírt értékek használhatók.
Plusz státusz esetén az alábbi értékek használhatók
0 1
NoList   enum full GET SET
A termékhez beállíthatod, hogy ne jelenjen meg a termék listákban, ajánlókban illetve a keresőben.
Használható értékek
0 1
Inquire   enum full GET SET
Beállítható, egy ún. érdeklődjön státusz a termékhez. Ekkor a termék a vásárló felületen megjelenik, nem vásárolható, a kosárgomb helyén "Érdeklődjön" felirat látható.
Használható értékek
0 1
CustDiscountDisable   enum full GET SET
Termékenként be tudod állítani, hogy legyen-e közvetlen kedvezmény a termék árából.
Használható értékek
0 1
OnlyGiftStatus   enum full GET SET
Termékenként be tudod állítani, hogy csak ajándékként vásárolható-e meg vagy sem.
Használható értékek
0 1
Explicit   enum full GET SET
A termék csak nagykorúaknak érhető el.
Használható értékek
0 1
Export   object full GET SET
Az export feed-ekkel kapcsolatos beállításokat tartalmazza.
Export.Status   enum full GET SET
Az export feed-ek státuszát tartalmazza ez a mező.
Használható értékek
0 1
Export.Forbidden   enum full GET SET
Ha engedélyezted már a termék export feed-ekben való megjelenését, lehetőséged van bizonyos export feed-ekből kitiltani. Ebben a mezőben sorolhatod fel a tiltott export feed-eket.
Export.Forbidden.Format   string full GET SET
Egy tiltott export feed formátum.
PublicInterval   string GET SET
A termék publikus időszaka.
PublicInterval.Start   string GET SET
A termék publikus időszakának kezdeti dátuma. Elvárt formátum Y.m.d H:i:s
PublicInterval.End   string GET SET
A termék publikus időszakának lejárati dátuma. Elvárt formátum Y.m.d H:i:s
Name   string mandatory GET SET LANG
A termék neve.
Unit   string mandatory GET SET LANG
A termék mennyiségi egysége.
MinimumQty   float GET SET
A termék minimum rendelhető mennyisége.
MaximumQty   float GET SET
A termék maximum rendelhető mennyisége.
AlertQty   float normal GET SET
A termék alacsony készlet értéke. Értesítést küld ki a rendszer, ha ezt az értéket eléri a termék raktárkészlete.
UnitStep   float normal GET SET
Lépésköz.
AlterUnit   object normal GET SET
A termék másodlagos egysége.
AlterUnit.Qty   float normal GET SET
Ebben a mezőben határozhatod meg, hogy egy alapegység, hány másodlagos egység. Egy példa: ha a termék alapegysége csomag, másodlagos egysége darab, akkor 1 csomag = 50 db.
AlterUnit.Unit   float normal GET SET LANG
A termék másodlagos egység értéke.
Weight   float normal GET SET
A termék tömege kilogrammban.
Point   enum full GET SET
A termék megvásárlása után járó pontérték.
Használható értékek
default A termék után az áruházi alapbeállítás alapján kapható pont
no Nem jár a termék után pont
pont érték A konkrét pontérték jár a termék megvásárlásáért
BuyableWithPoint   enum full GET SET
A termék megvásárolható-e pontért.
Használható értékek
yes Igen
no Nem
only Csak pontért vásárolható meg
Description   object normal GET SET
Termék leírások.
Description.Short   string normal GET SET LANG
Rövid leírás.
Description.Long   string normal GET SET LANG
Részletes leírás.
Prices   object full GET SET
A termékhez tartozó árak.
Prices.Appearance   string GET SET
Korábbi/akciós ár megjelenítési módja. Az adattag értéke lehet üres is, ez esetben az áruházi alapbeállítás jut érvényre - bővebb információ itt található ennek kapcsán.
Használható értékek
sale Normál akciós ár
rrp RRP ár (ajánlott kiskereskedelmi ár)
Prices.Vat   string short GET
Áfa értéke.
Prices.Price   object short GET SET
A termék egy árát leíró mező.
Prices.Price.Type   enum short GET SET
Az termék árának típusa.
Használható értékek
normal Normál ár mandatory
sale Akciós ár
special További ár, csak full lekérés esetén
Prices.Price.Net   float GET SET
Nettó ár.
Prices.Price.Gross   float GET SET
Bruttó ár.
Prices.Price.Start   date GET SET
sale vagyis akciós ár típus esetén az akció kezdetének időpontja. Az elvárt dátumformátum YYYY.MM.DD.
Prices.Price.End   date GET SET
sale vagyis akciós ár típus esetén az akció lejáratának időpontja. Az elvárt dátumformátum YYYY.MM.DD.
Prices.Price.SaleNet   float full GET SET
special vagyis további ár típus esetén az akciós nettó ár.
Prices.Price.SaleGross   float full GET SET
special vagyis további ár típus esetén az akciós bruttó ár.
Prices.Price.Percent   string full GET SET
special vagyis további ár típus esetén a százalékos eltérés mértéke, amennyiben százalék alapú a további ár.
Prices.Price.SaleStart   float full GET SET
Akciós további árhoz az akció kezdetének időpontja. Az elvárt dátumformátum YYYY.MM.DD.
Prices.Price.SaleEnd   float full GET SET
Akciós további árhoz az akció lejáratának időpontja. Az elvárt dátumformátum YYYY.MM.DD.
Prices.Price.Group   integer full GET SET
special vagyis további árhoz tartozó vásárló csoport. Ha a vásárló ebben a csoportban van, akkor a további áron tudja megvásárolni a terméket.
Prices.Price.GroupName   string full GET SET
special vagyis további árhoz tartozó vásárló csoport neve.
Prices.Price.Area   string full GET SET
special vagyis további árhoz tartozó szállítási terület. Ha a vásárlóra érvényes a szállítási terület, érvényre jut a további ár.
Prices.Price.AreaName   string full GET SET
special vagyis további árhoz tartozó terület neve.
Prices.Price.CurrencyFilter   string full GET SET
special vagyis további árhoz tartozó pénznem. Ha a vásárló ezen pénznemben vásárol, akkor jut érvényre a további ár.
Prices.Price.Currency   string full GET SET
speical vagyis további árhoz tartozó pénznem használatakor a bruttó és nettó ár ebben a pénznemben értendő.
QtyDiscount   object full GET SET
Mennyiségi kedvezmény. A termékhez beállítható alapárhoz illetve további árhoz is. A további árak esetében a Prices.Price.QtyDiscount mezőt kell használni. Meglévő érték törléséhez üres node-ot kell küldeni a kérésben.
QtyDiscount.DiscountType   enum full GET SET
Mennyiségi kedvezmény típusa.
Használható értékek
amount_fix Kedvezményes ár
amount_discount A kedvezmény mértéke. Negatív érték esetén kedvezményként, pozitív érték használatakor felárként értelmezhető.
percent A százalékos kedvezmény mértéke
QtyDiscount.Step   enum full GET SET
Egy mennyiségi kedvezmény sávot leíró mező.
QtyDiscount.Step.Limit   enum full GET SET
Mennyiség határok.
QtyDiscount.Step.Limit.Lower   enum full GET SET
A mennyiségi határ alsó értéke.
QtyDiscount.Step.Limit.Upper   enum full GET SET
A mennyiségi határ felső értéke.
QtyDiscount.Step.Price   enum full GET SET
Kedvezményes ár amount_fix típus esetében.
QtyDiscount.Step.Discount   enum full GET SET
Kedvezmény mértéke amount_discount és percent típusok esetében.
Categories   object GET SET
A termék kategóriái. Egy termék több kategóriába is sorolható.
Categories.Category   object GET SET
Egy termék kategóriát leíró mező.
Categories.Category.Type   enum GET SET
A termék kategória típusa.
Használható értékek
base A termék alap kategóriája mandatory
alt A termék alternatív kategóriája, full lekérés esetén jelenik meg a válaszban
Categories.Category.Id   integer GET SET
A termék kategória egyedi azonosítója.
Categories.Category.Name   string short GET SET
A termék kategória neve.
Subscription   object GET SET
A termék előfizethetőségére vonatkozó adatok.
Subscription.Type   string GET SET
A termék előfizetés típusa.
Használható értékek
no Nem előfizethető
subscribable Előfizethető
only_subscribable Csak előfizethető
Subscription.Periods   object GET SET
A termék előfizetési ciklusai.
Subscription.Periods.Period   integer GET SET
A termék egy konkrét előfizetési ciklusa.
Url   string short GET
A termék oldal URL-je.
SefUrl   string short GET SET LANG
A termék oldal keresőbarát URL-je az áruház domain neve nélkül.
ManufacturerUrl   string GET SET LANG
A termékhez külön, dedikált adatként megadható gyártói vagy termék weboldala.
Images   object short GET SET
A termék képek.
Images.DefaultFilename   string short GET SET LANG
Alapértelmezett képfájlnév.
Images.DefaultAlt   string short GET SET LANG
Alapértelmezett kép ALT/TITLE attribútum.
Images.OG   string GET SET
A termék képei közül az OG kép sorszáma.
Images.Connect   string GET SET
Ha a termék egy másik termék képét használja, a másik termék cikkszáma jelenik meg ezen adattagban.
Images.Version   string SET
Kép verzió. Csak setProduct végpontnál használható. A meglévő képek módosításakor értelmezett. Kérünk, hogy kép verziót valóban csak indokolt esetben küldj, azaz képet csak akkor cserélj az áruházban, ha az valóban változott, így elkerülhetők az alábbi limitációk!
Limitációk
Ha 5 alkalommal küldtél már kép verziót, azt követően hetente egyszer fogjuk csak feldolgozni a kép verzió frissítést.
Ha 10 alkalommal volt már kép verzió megadás, azt követően két hetente egyszer dolgozzuk fel a kérést.
Ha 15 alkalommal volt kép verzió megadva, havonta egyszer dolgozzuk fel kérést.
Ha 20 alkalom vagy annál többször, úgy pedig csak kéthavonta egyszer dolgozzuk fel a képfrissítési kérést.
A felsorolt limitációkat termékenként kell értelmezni.
Images.LastModTime   unix timestamp full GET
A termékképek utolsó módosításának időpontja időbélyeg (Unix timestamp) formátumban.
Images.Image   object GET SET
Egy termék kép adatait leíró mező.
A getProduct kérésben a termék alapértelmezett képe már a short kérés válaszában is szerepel, míg a további képek csak a full kérés válaszában jelennek meg!
Images.Image.Type   enum GET SET
A kép típusa.
Használható értékek
base A termék alapértelmezett képe
alt A termék plusz képei, full lekérés esetén jelennek meg a válaszban.
Images.Image.SefUrl   string GET
A kép keresőbarát URL-je.
Images.Image.Filename   string GET SET LANG
A kép fájlneve.
Images.Image.Alt   string GET SET LANG
A kép ALT / TITLE attribútuma.
Images.Image.Import   object SET
Az importálandó képek. Csak setProduct végpontnál használható, időzítve töltjük át a képeket, ha még nincs kép rögzítve a termékhez.
Images.Image.Import.Url   string SET
Az importálandó kép URL-je.
Images.Image.Import.Encoded   string SET
Az importálandó kép file tartalma base64 módon kódolva.
Images.Image.Id   string GET SET
A további kép sorszáma 1 és 9 között. alt képek esetén használható mező.
Variants   object normal GET SET
Termék változatok. Maximum három változatot lehet használni egy termékhez.
Variants.Variant   object normal GET SET
A termék egy választható tulajdonsága, változata.
Variants.Variant.Name   string normal GET SET LANG
A változat neve.
Variants.Variant.Values   string normal GET SET
A változat értékei.
Variants.Variant.Values.Value   object normal GET SET LANG
Egy változat konkrét értéke (pl. piros).
Variants.Variant.Values.Value.Name   string normal GET SET LANG
Egy változat érték konkrét neve (pl. szín).
Variants.Variant.Values.Value.ExtraPrice   float normal GET SET
Egy változat árkülönbözete.
NotVisibleInLanguage   object full GET SET
A termék melyik áruházi nyelven nem elérhető.
NotVisibleInLanguage.Language   string full GET SET
A tiltott nyelv angol nyelvű megnevezése (pl. Hungarian, English stb.).
AutomaticCoupon   string full GET SET
A termék vásárlását követően automatikusan kiküldendő kupon sablonja.
CustomerGroupOnly   object full GET SET
A termék láthatóságát és vásárolhatóságát befolyásoló adat.
CustomerGroupOnly.VisibleFor   object full GET SET
A termék láthatóságát leíró mező.
CustomerGroupOnly.VisibleFor.CustomerGroup   object full GET SET
Az adott vásárló csoport számára látható a termék.
CustomerGroupOnly.BuyableFor   object full GET SET
A termék vásárolhatóságát leíró mező.
CustomerGroupOnly.BuyableFor.CustomerGroup   object full GET SET
Az adott vásárló csoport számára vásárolható a termék.
Datas   object full GET
Plusz adatok. Egy termékhez maximum három használható.
Datas.Data   object full GET
Egy plusz adatot leíró mező.
Datas.Data.Id   integer full GET
A plusz adat sorszáma.
Datas.Data.Name   string full GET SET LANG
A plusz adat neve.
Datas.Data.Value   string full GET SET LANG
A plusz adat értéke.
Params   string full GET SET
Termékhez beállítható termék paraméterek.
Params.Param   string full GET SET
Egy termék paramétert leíró mező.
Params.Param.Id   integer full GET SET
A termék paraméter egyedi azonosítója.
Params.Param.Type   enum full GET
A termék paraméter típusa.
Használható értékek
text Szabad szavas. Bármilyen szöveges értéket felvehet a paraméter értékként (pl.: vásárolható; nem vásárolható).
textmore Szabad szavas, többértékű (TAG). Vesszővel elválasztva vehet fel több tetszőleges értéket (pl.: alma, körte, banán).
enum Értékkészlet. Vesszővel elválasztva vehet fel több, előre definiált értéket (pl.: alma, körte, banán).
enummore Értékkészlet, többértékű. Vesszővel elválasztva vehet fel több, előre definiált értéket (pl.: alma, körte, banán).
num Szám. Csak szám értékeket vehet fel (pl.: 7560).
interval Intervallum. Az alsó és felső határát kötőjellel elválasztva határozhatod meg (pl.: 6 - 7). Szóköz kell a kötőjel elé és mögé is.
color Szín. Hexadecimális színkódot vehet fel értékként (pl.: #4bb9f4).
color_text Szín és szöveg. Hexadecimális színkódot, hozzá tetszőleges szöveget vehet fel értékként (pl.: #4bb9f4 - kék).
link Link. Valós URL lehet a paraméter értéke (pl.: https://unas.hu).
linkblank Link, új ablakban megnyitva. Valós URL lehet a paraméter értéke (pl.: https://unas.hu).
link_text Szöveges link. Valós URL és egy hozzátartozó szöveg lehet a paraméter értéke (pl.: https://unas.hu - Unas kezdőoldal).
html HTML. Értéke HTML tartalom.
icon Ikon. Az áruházba előre feltöltött ikon sorszámát veheti fel (pl.: 3).
iconmore Ikon, többértékű. Több előre feltöltött ikon sorszámát veheti fel értékként, vesszővel elválasztva (pl.: 1,2,3).
pic Kép (pl.: https://unas.hu/image.jpg).
piclink Kép fájlkezelőből
piclinktext Kép fájlkezelőből alternatív szöveggel
date Dátum, az áruházban kezelhető nap típusok értékével megadva (pl.: 10|day). A pipe karakter utáni lehetséges értékek: day day_except_weekend day_except_holidays day_except_weekend_and_holidays


Az alábbi három típus értéke 0 illetve off vagy 1 illetve on lehet, tehát be és kikapcsolni lehet a terméknél őket.
cust_input_text Vásárló által megadható szövegbeviteli mező a termék részletek oldalon
cust_input_select Vásárló által kiválasztható Legördülő menü a termék részletek oldalon
cust_input_file Vásárló által megadható fájlfeltöltő mező a termék részletek oldalon
Params.Param.Name   string full GET SET
A termék paraméter megnevezése.
Params.Param.Group   string full GET SET
A termék paraméter csoportja.
Params.Param.Value   string full GET SET LANG
A termék paraméter értéke. Az értékek elvárt formátumát a paraméter típusok felsorolásánál láthatod.
Params.Param.Before   string full GET
Szöveg az érték előtt. Intervallum és szám típusú termék paraméter esetén használható.
Params.Param.After   string full GET
Szöveg az érték után. Intervallum és szám típusú termék paraméter esetén használható.
AdditionalDatas   object full GET SET
Termék további lapfülek. Maximum három darab lehet egy terméknél.
AdditionalDatas.AdditionalData   object full GET SET
Egy további lapfület leíró mező.
AdditionalDatas.AdditionalData.Id   object full GET SET
A további lapfül azonosítója.
AdditionalDatas.AdditionalData.Title   string full GET SET LANG
A további lapfül címe.
AdditionalDatas.AdditionalData.Content   string full GET SET LANG
A további lapfül tartalma.
AdditionalProducts   object full GET SET
Kiegészítő termékek.
AdditionalProducts.AdditionalProduct   object full GET SET
Egy kiegészítő terméket leíró mező.
AdditionalProducts.AdditionalProduct.Id   integer full GET
A kiegészítő termék egyedi azonosítója.
AdditionalProducts.AdditionalProduct.Sku   string full GET SET
A kiegészítő termék cikkszáma.
AdditionalProducts.AdditionalProduct.Name   string full GET
A kiegészítő termék neve.
SimilarProducts   object full GET SET
Hasonló termékek.
SimilarProducts.SimilarProduct   object full GET SET
Egy hasonló terméket leíró mező.
SimilarProducts.SimilarProduct.Id   integer full GET
A hasonló termék egyedi azonosítója.
SimilarProducts.SimilarProduct.Sku   string full GET SET
A hasonló termék cikkszáma.
SimilarProducts.SimilarProduct.Name   string full GET
A hasonló termék neve.
CrossSale   object full GET SET
A termék cross sale beállításai.
CrossSale.Cart   string full GET SET
Keresztértékesítési ajánlat a kosár alatt.
CrossSale.CartPopup   string full GET SET
Keresztértékesítési ajánlat a kosárba helyezésekor felugró ablakban kiegészítő termékek alapján.
CrossSale.Artdet   string full GET SET
Keresztértékesítési ajánlat a termék oldalon kiegészítő termékek alapján.
UpSale   object full GET SET
A termék upsale beállításai.
UpSale.Cart   string full GET SET
Drágább termék ajánlat a kosár oldal alján.
UpSale.CartPopup   string full GET SET
Drágább termék ajánlat a kosárba helyezésekor felugró ablakban hasonló termékek alapján.
Stocks   string normal GET SET
Termék raktárkészletét leíró mező.
Stocks.Status   string normal GET SET
Raktárkészlet státuszok.
Stocks.Status.Active   enum normal GET SET
Raktárkészlet kezelés aktív e vagy sem.
Használható értékek
0 1
Stocks.Status.Empty   enum normal GET SET
A termék vásárolható, ha nincs raktáron beállítás értéke.
Használható értékek
0 1
Stocks.Status.Variant   enum normal GET SET
Változatokhoz kapcsolt raktárkészlet kezelés.
Használható értékek
0 1
Stocks.Stock   object normal GET SET
Egy konkrét készlethez tartozó adatok.
Stocks.Stock.WarehouseId   integer GET SET
További raktár azonosítója. A getProduct kérésben egy további raktár készletéről kaphatsz információt. A setProduct kérésben azonosítja a további raktárat.
Stocks.Stock.IsActive   enum GET SET
További raktárak kapcsán a készlet fogyaszthatóságát ellenőrizheted.
Használható értékek
yes
no
Stocks.Stock.Qty   string normal GET SET
Raktárkészlet értéke.
Stocks.Stock.Price   float GET SET
Készletrögzítés során alkalmazott beszerzési ár.
Stocks.Stock.Comment   string SET
A raktárkészlet változáshoz megadható plusz információ, megjegyzés, így értelemszerűen csak setStock végpontnál használható.
Stocks.Stock.Variants   string normal GET SET
Termék változathoz kötött raktárkészlet értékek.
Stocks.Stock.Variants.Variant   string normal GET SET
Konkrét változat kombinációt megadó adat (max. három lehet belőle).

Az alábbi példa egy három változattal rendelkező termék készlet kezelését mutatja be, mely egy S méretű, kék színű, pamut anyagú pulóver 10 darab készleten levő mennyiséggel.
...
<Stocks>
	<Status>
		<Active>1</Active>
		<Empty>1</Empty>
		<Variant>1</Variant>
	</Status>
	<Stock>
		<Variants>
			<Variant><![CDATA[Kék]]></Variant>
			<Variant><![CDATA[S]]></Variant>
			<Variant><![CDATA[Pamut]]></Variant>
		</Variants>
		<Qty>10</Qty>
	</Stock>
</Stocks>
...


CustomOrderValue   integer GET SET
Egyedi sorrend érték. Ha nem akarod használni, állíts be 0 értéket.
OnlineContent   object full GET
Online letölthető tartalom.
OnlineContent.Url   string full GET
Letölthető tartalomra mutató link.
OnlineContent.Limit   string full GET
Tartalom letöltési limit.
OnlineContent.Filename   string full GET
Letölthető tartalom fájlneve.
Stickers   object full GET SET
Terméknél alkalmazott matricák.
Stickers.Sticker   object full GET SET
Egy adott matrica adatai.
Stickers.Sticker.Id   integer full GET SET
A matrica áruházbeli azonosítója.
Stickers.Sticker.Name   string full GET SET
A matrica áruházbeli neve.
PlusServices   string full GET SET
Plusz szolgáltatások.
PlusServices.PlusServiceBehavior   string full GET SET
Plusz szolgáltatás működését leíró mező.
Használható értékek
default Alapértelmezett
not required Nem kötelező választani
required, redirect Kötelező választani, lista oldalról részletek oldalra irányítva a vásárlót
required, first option Kötelező választani, alapértelmezetten az első szolgáltatás kerül kosárba
PlusServices.PlusService   string full GET SET
Egy plusz szolgáltatást leíró mező.
PlusServices.PlusService.Id   string full GET SET
A plusz szolgáltatás egyedi azonosítója.
PlusServices.PlusService.Name   string full GET SET
A plusz szolgáltatás neve.
ShippingMethods   string full GET SET
Termékre vonatkozó szállítási mód tiltások és engedélyezések.
ShippingMethods.Denied   string full GET SET
Tiltott szállítási módok.
ShippingMethods.Denied.Method   string full GET SET
Egy konkrét szállítási mód.
ShippingMethods.Denied.Method.Id   string full GET SET
Szállítási mód azonosítója.
ShippingMethods.Denied.Method.Name   string full GET SET
Szállítási mód neve.
ShippingMethods.Activated   string full GET SET
Engedélyezett szállítási módok.
ShippingMethods.Activated.Method   string full GET SET
Egy konkrét szállítási mód.
ShippingMethods.Activated.Method.Id   string full GET SET
Szállítási mód azonosítója.
ShippingMethods.Activated.Method.Name   string full GET SET
Szállítási mód neve.
ShippingMethods.Cost   string full GET SET
Termékszintű plusz szállítási költségek szállítási módonként.
ShippingMethods.Cost.Method   string full GET SET
Egy konkrét szállítási mód.
ShippingMethods.Cost.Method.Id   string full GET SET
Szállítási mód azonosítója.
ShippingMethods.Cost.Method.Name   string full GET SET
Szállítási mód neve.
ShippingMethods.Cost.Method.Value   string full GET SET
Szállítási módhoz rögzített termékszintű szállítási költség értéke.
PaymentMethods   string full GET SET
Termékre vonatkozó fizetési mód tiltások és engedélyezések.
PaymentMethods.Denied   string full GET SET
Tiltott fizetési módok.
PaymentMethods.Denied.Method   string full GET SET
Egy konkrét fizetési mód.
PaymentMethods.Denied.Method.Id   string full GET SET
Fizetési mód azonosítója.
PaymentMethods.Denied.Method.Name   string full GET SET
Fizetési mód neve.
PaymentMethods.Activated   string full GET SET
Engedélyezett fizetési módok.
PaymentMethods.Activated.Method   string full GET SET
Egy konkrét fizetési mód.
PaymentMethods.Activated.Method.Id   string full GET SET
Fizetési mód azonosítója.
PaymentMethods.Activated.Method.Name   string full GET SET
Fizetési mód neve.
PaymentMethods.Cost   string full GET SET
Termékszintű plusz kezelési költségek fizetési módonként.
PaymentMethods.Cost.Method   string full GET SET
Egy konkrét fizetési mód.
PaymentMethods.Cost.Method.Id   string full GET SET
Fizetési mód azonosítója.
PaymentMethods.Cost.Method.Name   string full GET SET
Fizetési mód neve.
PaymentMethods.Cost.Method.Value   string full GET SET
Fizetési módhoz rögzített termékszintű kezelési költség értéke.
Types   string short GET SET
Típus összevonás adatok.
Types.Type   string short GET SET
Ez a mező megmutatja, hogy alap típus vagy altípus a termék az összevonásban.
Lehetséges értékek
parent Alap típus
child Altípus
Types.Parent   string short GET SET
Ha a termék altípus, a hozzá tartozó alap típus cikkszámát jelöli.
Types.Children   object short GET SET
Ha a termék alap típus, a hozzá tartozó altípusok cikkszámait jelöli.
Types.Children.Child   string short GET SET
Egy konkrét altípus cikkszáma.
Types.Display   enum short GET SET
A termék megjelenik a termék listában vagy sem.
Használható értékek
0 1
Types.Order   integer short GET SET
A termék sorrend értéke az összevonásban.
PackageProduct   enum full GET
A termék csomagtermék-e vagy sem.
PackageComponents   object full GET SET
Csomagtermék esetén a csomag tartalmát leíró mező.
PackageComponents.Component   object full GET SET
A csomagtermék tartalmának egy alkotó eleme.
PackageComponents.Component.Sku   string full GET SET
A csomagtermék alkotó elemének cikkszáma.
PackageComponents.Component.Qty   integer full GET SET
A csomagtermék alkotó elemének mennyisége.
Meta   object full GET SET
A termék Meta adatai.
Meta.Keywords   string full GET SET LANG
A termék meta kulcsszó (keywords) értéke.
Meta.Description   string full GET SET LANG
A termék meta leírás (description) értéke.
Meta.Title   string full GET SET LANG
A termék meta cím (title) értéke.
Meta.Robots   string full GET SET
A termék meta robots beállítás értéke.
AutomaticMeta   object full GET
A rendszer által automatikusan generált meta adatok.
AutomaticMeta.Keywords   string full GET
A termék automatikusan generált meta kulcsszó (keywords) értéke.
AutomaticMeta.Description   string full GET
A termék automatikusan generált meta leírás (description) értéke.
AutomaticMeta.Title   string full GET
A termék automatikusan generált meta cím (title) értéke.
getProductDB kérés
A végpont segítségével tudod lekérni az áruházadból tömegesen, adatbázis formájában a termékeket.
Format   enum
A termékadatbázis fájl formátuma.
Lehetséges értékek
csv Vesszővel elválasztott adatok
csv2 Pontosvesszővel elválasztott adatok, alapértelmezett érték
xls Excel5 formátum
xlsx Excel2007 formátum
txt Tabulátorral elválasztott adatok
Compress   enum
Meghatározhatod, hogy tömörítve szeretnéd-e letölteni a termék adatbázist.
Használható értékek
yes no
LimitNum   integer
Ebben a mezőben meghatározhatod, hogy mennyi terméket szeretnél letölteni.
LimitStart   integer
Ha nem az összes terméket szeretnéd letölteni, itt adhatod meg, hogy hányadik terméktől induljon a letöltés. Pozitív egész szám, csak a LimitNum paraméterrel együtt használható.
Order   enum
Termékek rendezése.
Lehetséges értékek
category Kategóriák szerint (default)
price Ár szerint
name Termék neve szerint
sku Cikkszám szerint
id Azonosító szerint
Category   integer
Ebben a mezőben egy kategória egyedi azonosítóját használhatod fel. Az általad választott kategóriában szereplő termékek jelennek meg a válaszban.
Lang   string
Meghatározhatod, milyen nyelven szeretnéd letölteni a szöveges adatokat. Ha a választott nyelvhez nem létezik tartalom, akkor az alap nyelvű változata szerepel majd a válaszban. A nyelv ISO 639-1 szabvány szerinti két karakteres kódját kell használnod (pl.: hu, en, de).
TimeStart   unix timestamp
A mezőben meghatározott időbélyeg után módosított termékek kerülnek bele a válaszba.
TimeEnd   unix timestamp
A mezőben meghatározott időbélyeg előtt módosított termékek kerülnek a válaszba.
Termék adatbázis oszlopok szűrése
Ha az alábbi mezők közül legalább egy szerepel a kérésben ("1" értéket kell megadni), akkor csak a termék cikkszáma és a megjelölt oszlop fog szerepelni a termék adatbázisban.
GetName Termék neve
GetStatus Termék státusza
GetPrice Termék normál nettó és bruttó ára
GetPriceSale Termék akciós nettó és bruttó ára
GetPriceSpecial További árak
GetCategory Kategória
GetDescriptionShort Rövid leírás
GetDescriptionLong Tulajdonságok
GetLink Termékhez rögzített gyártó linkje
GetMinQty Minimum rendelhető mennyiség
GetStock Raktárkészlet
GetUnit Mennyiségi egység
GetAlterUnit Másodlagos mennyiségi egység
GetWeight Tömeg
GetPoint Termék után járó pont
GetParam Termék paraméterek
GetData Plusz adatok
GetAttach Kapcsolódó termékek, hasonló termékek
GetPack Csomagtermék
GetVariant Választható tulajdonságok
GetAlterCategory Alternatív kategóriák
GetImage Kép Link
GetURL Termék részletek oldal URL-je
GetExport Termék export beállítások
GetOrder Egyedi sorrend érték
GetExplicit Excplicit tartalom
GetOnlineContent Online letölthető tartalom
GetSeo SEF URL, Title, Description, Keywords, Alt
GetType Alap típus
GetImageConnect Képkapcsolat
GetDiscount Kedvezmények
GetUnitStep Lépésköz
GetShipping Szállítási mód funkciók
GetPayment Fizetési mód funkciók
GetCustomerGroup Hozzárendelt vásárló csoport
GetLang Hozzárendelt nyelv
GetAddModDate Létrehozás dátuma, utolsó módosítás dátuma
GetService Plusz szolgáltatások
getProductDB válasz
getProductDB válasz
A getProductDB válaszban egy URL szerepel, ami az API által generált termék adatbázisra mutat. Ezt a fájlt a hívást követően 1 óráig tudod letölteni a válaszban szereplő link használatával.
Url   string
A generált termékadatbázisra mutató link.
Például
https://api.unas.eu/shop/temp/fa9cc339446f823978c7f7e6e6a7fb657ae30a26.csv
setProductDB kérés
A végpont segítségével tudsz feltölteni adatbázis használatával, tömegesen termék adatokat, így módosítva vagy létrehozva termékeket az áruházban.
Url   string
Az importálandó termékadatbázis eléréséhez szükséges teljes URL.
DB   base64 encoded string
Az importálandó adatbázis base64 encode-olva. Akkor használható, ha nincs URL a setProductDB kérésben.
DelType   enum
A termék adatbázis importálása előtt mely adatok törlődjenek.
Használható értékek
no Semmi se törlődjön
product Csak a termékek törlődjenek
all A termékek és a kategóriák teljes törlése
inverse Fordított import folyamat, az adatbázisban szereplő termékek törlődnek.
Lang   string
Meghatározhatod, milyen nyelven szeretnéd visszatölteni a szöveges adatokat. A nem szöveges adatokat és a kategória neveket a rendszer figyelmen kívül hagyja. A nyelv ISO 639-1 szabvány szerinti két karakteres kódját kell használnod (pl.: hu, en, de).
setProductDB válasz
Ok   object
A termékadatbázis sikeres feltöltése esetén ez a mező írja le a termék adatbázis állapotát.
Ok.Modify
Módosított termékek száma.
Ok.Add
Létrehozott termékek száma.
Ok.Delete
Törölt termékek száma.
Error
A termék adatbázis importálása során fellépő hibákat tartalmazó mező.
Error.UnknownColumns
Ismeretlen oszlopok száma.
Error.FaultyProducts
Hibás termékek száma.
Error.SKU_Duplicity
A feltöltött adatbázisban több sorban is ugyanaz a cikkszám.
Error.NewProductFewData
Új termék létrehozásához kevés adat áll rendelkezésre.
Error.LimitError
Az import után a termékek száma meghaladná a megrendelt csomag termék limitjét.
Példák
Termékek lekérése
Ebben a példában egy getProduct kérést láthatsz. A getProduct válaszban csak aktív termékek fognak szerepelni, maximum 50 darab termék a huszadik terméktől kezdve. FULL lekérés látható, így a termék összes adata szerepelni fog a válaszban.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <StatusBase>1</StatusBase>
    <LimitNum>50</LimitNum>
    <LimitStart>20</LimitStart>
    <ContentType>full</ContentType>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
	    <Action>modify</Action>
		<State>live</State> 
		<Id>200000</Id>
		<Sku>Cikkszam2</Sku>
		<SkuNew>Cikkszam2</SkuNew>
		<History>
			<Event>
				<Action>add</Action>
				<Time>1348483563</Time>
				<Sku>Cikkszam2_old</Sku>
			</Event>
			<Event>
				<Action>modify</Action>
				<Time>1348483571</Time>
				<Sku>Cikkszam2</Sku>
				<SkuOld>Cikkszam2_old</SkuOld>
			</Event>
		</History> 
		<Statuses>
			<Status>
				<Type>base</Type>
				<Value>1</Value>
			</Status>
			<Status> 
				<Type>plus</Type>
				<Id>1</Id>
				<Name><![CDATA[Előrendelhető]]></Name>
				<Value>1</Value> 
			</Status>
			<Status>
				<Type>plus</Type>
				<Id>2</Id>
				<Name><![CDATA[Külső raktáron]]></Name>
				<Value>0</Value>
			</Status>
		</Statuses>
		<NoList>0</NoList>
		<Inquire>0</Inquire>
		<CustDiscountDisable>0</CustDiscountDisable>
		<Explicit>0</Explicit>
		<Export>
			<Status>1</Status>
			<Forbidden>
				<Format>preisvergleich.de</Format>
				<Format>argep.hu</Format>
			</Forbidden>
		</Export>
		<PublicInterval>
		    <Start>2019.01.01 0:00</Start>
		    <End>2020.12.31 23:59</End>
		</PublicInterval>
		<Name><![CDATA[Termék név 2]]></Name>
		<Unit><![CDATA[csomag]]></Unit>
		<MinimumQty>1</MinimumQty> 
		<MaximumQty>5</MaximumQty>
		<AlertQty>5</AlertQty>
		<UnitStep><![CDATA[2]]></UnitStep>
		<AlterUnit>
			<Qty>10</Qty>
			<Unit><![CDATA[db]]></Unit>
		</AlterUnit>
		<Weight>1</Weight>
		<Point>10</Point>
		<BuyableWithPoint>yes</BuyableWithPoint>
		<Description>
			<Short><![CDATA[rövid leírás]]></Short>
			<Long><![CDATA[ez már hosszabb]]></Long>
		</Description>
		<Prices>
			<Vat>27%</Vat>
			<Price>
				<Type>normal</Type>
				<Net>2000</Net>
				<Gross>2540</Gross>
			</Price>
			<Price>
				<Type>sale</Type>
				<Start>2015.01.01</Start>
				<End></End>
				<Net>1000</Net>
				<Gross>1270</Gross>
			</Price>
			<Price>
				<Type>special</Type>
				<Group>100</Group>
				<Net>393.7008</Net>
				<Gross>500</Gross>
			</Price>
			<Price>
				<Type>special</Type>
				<Area>200</Area> 
				<AreaName><![CDATA[Belföld]]></AreaName>
				<Group>100</Group>
				<GroupName><![CDATA[Törzsvásárló]]></GroupName>
				<Net>629.9212</Net>
				<Gross>800</Gross>
			</Price>
			<Price> 
				<Type>special</Type>
				<Area>200</Area>
				<Group>200</Group>
				<Net>1000</Net>
				<Gross>1270</Gross>
				<SaleNet>629.9212</SaleNet>
				<SaleGross>800</SaleGross>
				<SaleStart>2017.01.01</SaleStart>
				<SaleEnd>2017.12.31</SaleEnd>
			</Price>
			<Price>
				<Type>special</Type>
				<Area>300</Area>
				<Group>300</Group>
				<Percent>20%</Percent>
			</Price>
			<Price>
				<Type>special</Type>
				<Area>300</Area>
				<Group>100</Group>
				<CurrencyFilter>EUR</CurrencyFilter>
				<Net>629.9212</Net>
				<Gross>800</Gross>
				<Currency>USD</Currency>
			</Price>
			<Price>
				<Type>special</Type>
				<Area>301</Area>
				<AreaName><![CDATA[Külföld]]></AreaName>
				<QtyDiscount>
					<DiscountType>amount_fix</DiscountType>
					<Step> 
						<Limit> 
							<Lower>0</Lower>
							<Upper>10</Upper>
						</Limit>
						<Price>1400</Price>
					</Step>
					<Step>
						<Limit>
							<Lower>10</Lower>
							<Upper>20</Upper>
						</Limit>
						<Price>1300</Price>
					</Step>
					<Step>
						<Limit>
							<Lower>20</Lower>
						</Limit>
						<Price>1200</Price>
					</Step>
				</QtyDiscount>
				<Net>1100.236186667</Net>
				<Gross>1400</Gross>
			</Price>
		</Prices>
		<Categories>
			<Category>
				<Type>base</Type>
				<Id>369560</Id>
				<Name><![CDATA[Főcsoport1|Alcsoport1]]></Name>
			</Category>
			<Category>
				<Type>alt</Type>
				<Id>292475</Id>
				<Name><![CDATA[Főcsoport1|Alcsoport2]]></Name>
			</Category>
			<Category>
				<Type>alt</Type>
				<Id>706395</Id>
				<Name><![CDATA[Főcsoport2|Alcsoport1]]></Name>
			</Category>
		</Categories>
		<Url><![CDATA[http://teszt.unas.hu/Cikkszam1]]></Url>
		<SefUrl><![CDATA[Cikkszam1]]></SefUrl> 
		<Images> 
			<DefaultFilename><![CDATA[termekkep]]></DefaultFilename> 
			<DefaultAlt><![CDATA[termeknev]]></DefaultAlt> 
			<OG>2</OG> 
			<Version>20200101</Version> 
			<Image> 
				<Type>base</Type> 
				<SefUrl><![CDATA[http://teszt.unas.hu/img/elso.jpg]]></SefUrl> 
				<Filename><![CDATA[fokepnev]]></Filename> 
				<Alt><![CDATA[fokepalt]]></Alt>
			</Image>
			<Image> 
				<Type>alt</Type> 
				<Id>1</Id> 
				<SefUrl><![CDATA[http://teszt.unas.hu/img/masodik.jpg]]></SefUrl> 
				<Filename><![CDATA[masodikkep]]></Filename> 
				<Alt><![CDATA[masodikalt]]></Alt> 
			</Image>
			<Image> 
				<Type>alt</Type> 
				<Id>2</Id> 
				<SefUrl><![CDATA[http://teszt.unas.hu/img/harmadik.jpg]]></SefUrl> 
				<Filename><![CDATA[harmadikkep]]></Filename> 
				<Alt><![CDATA[harmadikalt]]></Alt>
			</Image>
		</Images>
		<Variants> 
			<Variant> 
				<Name><![CDATA[Szín]]></Name> 
				<Values> 
					<Value> 
						<Name><![CDATA[Kék]]></Name> 
					</Value>
					<Value> 
						<Name><![CDATA[Piros]]></Name>
						<ExtraPrice>100</ExtraPrice> 
					</Value>
				</Values>
			</Variant>
			<Variant> 
				<Name><![CDATA[Méret]]></Name>
				<Values>
					<Value>
						<Name><![CDATA[S]]></Name>
						<ExtraPrice>-100</ExtraPrice>
					</Value>
					<Value>
						<Name><![CDATA[M]]></Name>
					</Value>
					<Value>
						<Name><![CDATA[L]]></Name>
						<ExtraPrice>200</ExtraPrice>
					</Value>
				</Values>
			</Variant>
		</Variants>
		<Datas> 
			<Data> 
				<Id>1</Id> 
				<Name><![CDATA[Garancia]]></Name> 
				<Value><![CDATA[Egy év]]></Value> 
			</Data>
			<Data> 
				<Id>2</Id>
				<Name><![CDATA[Szállítási Határidő]]></Name>
				<Value><![CDATA[Egy hét]]></Value>
			</Data>
		</Datas>
		<Params> 
			<Param> 
				<Id>1001</Id> 
				<Type>text</Type> 
				<Name><![CDATA[Paraméter 1]]></Name> 
				<Group><![CDATA[Csoport 1]]></Group> 
				<Value><![CDATA[Környakú]]></Value> 
			</Param>
			<Param> 
				<Id>1002</Id>
				<Type>textmore</Type> 
				<Name><![CDATA[Paraméter 2]]></Name>
				<Value><![CDATA[Érték 1, Érték 2, Érték 3]]></Value>
			</Param>
			<Param>
				<Id>1003</Id>
				<Type>enum</Type> 
				<Name><![CDATA[Paraméter 3]]></Name>
				<Value><![CDATA[Érték 1, Érték 2, Érték 3]]></Value>
			</Param>
			<Param>
				<Id>1004</Id>
				<Type>enummore</Type> 
				<Name><![CDATA[Paraméter 4]]></Name>
				<Value><![CDATA[Érték 1, Érték 2, Érték 3]]></Value>
			</Param>
			<Param>
				<Id>1005</Id>
				<Type>num</Type> 
				<Name><![CDATA[Paraméter 5]]></Name>
				<Value><![CDATA[100]]></Value>
				<Before><![CDATA[akármi]]></Before> 
				<After><![CDATA[db]]></After> 
			</Param>
			<Param>
				<Id>1006</Id>
				<Type>interval</Type> 
				<Name><![CDATA[Paraméter 6]]></Name>
				<Value><![CDATA[100 - 200]]></Value>
				<Before><![CDATA[akármi]]></Before> 
				<After><![CDATA[db]]></After> 
			</Param>
			<Param>
				<Id>1007</Id>
				<Type>color</Type> 
				<Name><![CDATA[Paraméter 7]]></Name>
				<Value><![CDATA[#ff00ff]]></Value>
			</Param>
			<Param>
				<Id>1008</Id>
				<Type>link</Type> 
				<Name><![CDATA[Paraméter 8]]></Name>
				<Value><![CDATA[http://unas.hu]]></Value>
			</Param>
			<Param>
				<Id>1009</Id>
				<Type>linkblank</Type> 
				<Name><![CDATA[Paraméter 9]]></Name>
				<Value><![CDATA[http://shop.unas.hu]]></Value>
			</Param>
			<Param>
				<Id>1010</Id>
				<Type>link_text</Type> 
				<Name><![CDATA[Paraméter 10]]></Name>
				<Value><![CDATA[http://unas.hu - UNAS]]></Value>
			</Param>
			<Param>
				<Id>1011</Id>
				<Type>html</Type> 
				<Name><![CDATA[Paraméter 11]]></Name>
				<Value><![CDATA[Teszt <b>szöveg</b>]]></Value>
			</Param>
			<Param>
				<Id>1012</Id>
				<Type>icon</Type> 
				<Name><![CDATA[Paraméter 12]]></Name>
				<Value><![CDATA[1]]></Value>
			</Param>
			<Param>
				<Id>1013</Id>
				<Type>iconmore</Type> 
				<Name><![CDATA[Paraméter 13]]></Name>
				<Value><![CDATA[1, 3, 10]]></Value>
			</Param>
			<Param>
				<Id>1014</Id>
				<Type>pic</Type> 
				<Name><![CDATA[Paraméter 14]]></Name>
				<Value><![CDATA[pic_194908_api_teszt.jpg]]></Value>
			</Param>
			<Param>
				<Id>1015</Id>
				<Type>piclink</Type> 
				<Name><![CDATA[Paraméter 15]]></Name>
				<Value><![CDATA[akarmi.jpg]]></Value>
			</Param>
			<Param>
				<Id>1016</Id>
				<Type>piclinktext</Type> 
				<Name><![CDATA[Paraméter 16]]></Name>
				<Value><![CDATA[akarmi.jpg - AKÁRMI]]></Value>
			</Param>
			<Param>
				<Id>1017</Id>
				<Type>date</Type> 
				<Name><![CDATA[Paraméter 17]]></Name>
				<Value><![CDATA[10|day]]></Value> 
			</Param>
		</Params>
        <AdditionalDatas> 
			<AdditionalData> 
				<Id>1</Id> 
				<Title><![CDATA[Első lapfül címe]]></Title> 
				<Content><![CDATA[Első lapfül tartalma]]></Content> 
			</AdditionalData>
			<AdditionalData> 
				<Id>2</Id> 
				<Title><![CDATA[Második lapfül címe]]></Title> 
				<Content><![CDATA[Második lapfül tartalma]]></Content> 
			</AdditionalData>
			<AdditionalData> 
				<Id>3</Id> 
				<Title><![CDATA[Harmadik lapfül címe]]></Title> 
				<Content><![CDATA[Harmadik lapfül tartalma]]></Content> 
			</AdditionalData>
		</AdditionalDatas>
		<QtyDiscount> 
			<Step> 
				<Limit> 
					<Lower>0</Lower> 
					<Upper>10</Upper> 
				</Limit>
				<Discount>0%</Discount> 
			</Step>
			<Step> 
				<Limit>
					<Lower>10</Lower>
					<Upper>20</Upper>
				</Limit>
				<Discount>5%</Discount>
			</Step>
			<Step> 
				<Limit>
					<Lower>20</Lower>
				</Limit>
				<Discount>10%</Discount>
			</Step>
		</QtyDiscount>
		<AdditionalProducts> 
			<AdditionalProduct> 
				<Id>70828162</Id> 
				<Sku>Cikkszam1</Sku> 
				<Name><![CDATA[Termék név 1]]></Name> 
			</AdditionalProduct>
			<AdditionalProduct> 
				<Id>63226347</Id>
				<Sku>Cikkszam3</Sku>
				<Name><![CDATA[Termék név 3]]></Name>
			</AdditionalProduct>
		</AdditionalProducts>
		<SimilarProducts> 
			<SimilarProduct> 
				<Id>85478568</Id> 
				<Sku>Cikkszam5</Sku> 
				<Name><![CDATA[Termék név 5]]></Name> 
			</SimilarProduct>
		</SimilarProducts>
		<Stocks> 
			<Status> 
				<Active>1</Active> 
				<Empty>1</Empty> 
				<Variant>1</Variant> 
			</Status>
			<Stock> 
				<Variants> 
					<Variant><![CDATA[Kék]]></Variant> 
					<Variant><![CDATA[S]]></Variant> 
				</Variants>
				<Qty>10</Qty> 
			</Stock>
			<Stock> 
				<Variants>
					<Variant><![CDATA[Piros]]></Variant>
					<Variant><![CDATA[M]]></Variant>
				</Variants>
				<Qty>20</Qty>
			</Stock>
		</Stocks>
		<OnlineContent> 
			<Url><![CDATA[http://teszt.hu/akarmi.pdf]]></Url> 
			<Limit>no</Limit> 
			<Filename>akarmi_mas.pdf</Filename> 
		</OnlineContent>
		<PlusServices> 
			<PlusService> 
				<Id><![CDATA[2789]]></Id> 
				<Name><![CDATA[szolgáltatás neve]]></Name> 
			</PlusService>
		</PlusServices>
		<Types> 
			<Type>child</Type> 
			<Parent>Cikkszam1</Parent> 
			<Display>0</Display> 
			<Order>1</Order> 
		</Types>
        <PackageProduct>no</PackageProduct> 
        <PackageComponents> 
            <Component> 
                <Sku>Cikkszam2</Sku> 
                <Qty>1</Qty> 
            </Component>
            <Component> 
                <Sku>Cikkszam3</Sku> 
                <Qty>3</Qty> 
            </Component>
        </PackageComponents>
		<Meta>  
			<Keywords><![CDATA[szuper jó, olcsó]]></Keywords> 
			<Description><![CDATA[erre alkalmas]]></Description> 
			<Title><![CDATA[címben ez is szerepel]]></Title> 
		</Meta>
		<AutomaticMeta>  
		    <Keywords><![CDATA[általános termék meta keyword]]></Keywords> 
			<Description><![CDATA[általános termék meta description]]></Description> 
			<Title><![CDATA[általános termék meta title]]></Title> 
		</AutomaticMeta>
	</Product>	
</Products>


Termék létrehozása
A második példában azt láthatod, hogyan tudsz terméket létrehozni. A példa XML-ben a kötelező adatokat láthatod, amik egy termék létrehozásakor szükségesek. Ezen felül a termék "Aktív, Új" státusszal jön létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
    <Product>
        <Action>add</Action>
        <Statuses>
            <Status>
                <Type>base</Type>
                <Value>2</Value>
            </Status>
        </Statuses>
        <Sku>8fga1239012</Sku>
        <Name>Első termékem</Name>
        <Unit>db</Unit>
        <Categories>
            <Category>
                <Id>678123</Id>
                <Name>Termékek|Alkategória 1</Name>
                <Type>base</Type>
            </Category>
        </Categories>
        <Prices>
            <Price>
                <Type>normal</Type>
                <Net>1000</Net>
                <Gross>1270</Gross>
            </Price>
        </Prices>
    </Product>
</Products>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>290684827</Id>
		<Sku>8fga1239012</Sku>
		<Action>add</Action>
		<Status>ok</Status>
	</Product>
</Products>


Termék módosítása
A következő példában módosításra kerül a 8fga1239012 cikkszámú termék, melynek létrehozását az előző példában láthatod. A termékhez hozzáadásra kerül egy leírás, akciós ár és mennyiségi kedvezmény valamint a termék státusza is megváltozik aktívra.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
    <Product>
        <Sku>8fga1239012</Sku>
        <Action>modify</Action>
        <Statuses>
            <Status>
                <Type>base</Type>
                <Value>1</Value>
            </Status>
        </Statuses>
        <Description>
            <Short>Ez lesz a termék rövid leírása.</Short>
            <Long>Ez lesz a termék részletes leírása. Ebben a leírásban már több infó szerepel mint a rövid leírásban.</Long>
        </Description>
        <Prices>
            <Price>
                <Type>normal</Type>
                <Net>2000</Net>
                <Gross>2540</Gross>
            </Price>
            <Price>
                <Type>sale</Type>
                <Net>1000</Net>
                <Gross>1270</Gross>
                <Start>2022.03.01</Start>
                <End>2022.03.25</End>
            </Price>
        </Prices>
    </Product>
</Products>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>290684827</Id>
		<Sku>8fga1239012</Sku>
		<Action>modify</Action>
		<Status>ok</Status>
	</Product>
</Products>


Több termék egyidejű módosítása
Az ötödik esetben arra mutatunk példát, hogy hogyan lehet egyszerre több termék bizonyos adatait frissíteni. Itt a termékek árai változnak, de természetesen lehetőség van tetszőleges adat kezelésére.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
    <Product>
        <Sku>8fga1239012</Sku>
        <Action>modify</Action>
        <Prices>
            <Price>
                <Type>normal</Type>
                <Net>2000</Net>
                <Gross>2540</Gross>
            </Price>
        </Prices>
    </Product>
    <Product>
        <Sku>9ghb234023</Sku>
        <Action>modify</Action>
        <Prices>
            <Price>
                <Type>normal</Type>
                <Net>1000</Net>
                <Gross>1270</Gross>
            </Price>
        </Prices>
    </Product>
    <Product>
        <Sku>7efz0128901</Sku>
        <Action>modify</Action>
        <Prices>
            <Price>
                <Type>normal</Type>
                <Net>3000</Net>
                <Gross>3810</Gross>
            </Price>
        </Prices>
    </Product>
</Products>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Products>
	<Product>
		<Id>159850145</Id>
		<Sku>8fga1239012</Sku>
		<Action>modify</Action>
		<Status>ok</Status>
	</Product>
	<Product>
		<Id>159850156</Id>
		<Sku>9ghb234023</Sku>
		<Action>modify</Action>
		<Status>ok</Status>
	</Product>
	<Product>
		<Id>159850146</Id>
		<Sku>7efz0128901</Sku>
		<Action>modify</Action>
		<Status>ok</Status>
	</Product>
</Products>


Adatbázis lekérése
A hatodik példa egy getProductDB hívást mutat be, lekérdezésre kerül adott áruház teljes termékpalettája, magyar nyelven, csv formátumú kimenettel.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Format>csv</Format>
    <Compress>no</Compress>
    <Lang>hu</Lang>
</Params>
Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<getProductDB>
	<Url>http://api11.unas.eu/shop/temp/e6cd8025e0994346e9ca19a2f6c870e8.csv</Url>
</getProductDB>


Adatbázis feltöltése
Egy setProductDB kérésre láthatsz mintát, az URL-en elérhető Unas formátumú termék adatbázis kerül feltöltésre az áruházba, magyar nyelven. A példában 64 darab termék sikeresen feltöltésre kerül, míg egy terméknél hibát jelez a rendszer - ez látható is a válaszban.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Url>https://teszt.unas.hu/mintaadatbazis.csv</Url>
    <DelType>no</DelType>
    <Lang>hu</Lang>
</Params>
Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<setProductDB>
	<Ok>
		<Add>64</Add>
	</Ok>
	<Error>
		<FaultyProducts><![CDATA[1]]></FaultyProducts>
	</Error>
</setProductDB>
Termék paraméterek
Az áruházban a különböző termék adatokat tetszőleges számú és különböző típusú paraméterekbe is megadhatod, hogy még színesebbé tedd termékeidet a vásárlók számára. Funkcionális hasznuk is van, hiszen többek között a termék lista szűréseket is a paraméterek segítségével tudsz kezelni. Ezen adatok kezelésére, létrehozására, módosítására tudod használt a jelen menüpontban részletezett végpontokat.
getProductParameter
A getProductParameter végpont visszaadja a kérésben meghatározott feltételeknek megfelelő termék paramétereket.
Végpont: https://api.unas.eu/shop/getProductParameter
A getProductParameter kérésben láthatod, hogy milyen módon lehet a termék paramétereket listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy paraméter lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több paraméter lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setProductParameter
A setProductParameter végpont segítségével létrehozhatsz, módosíthatsz, törölhetsz termék paramétereket.
Végpont: https://api.unas.eu/shop/setProductParameter
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setProductParameter kérést, melynek a válaszát a setProductParameter válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 paramétert tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 paramétert tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getProductParameter kérés
getProductParameter kéréssel listázhatod az áruházban meglévő termék paramétereket. A kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz.
Id   integer
A termék paraméter egyedi azonosítója.
Type   enum
Meghatározhatod, hogy milyen típusú termék paraméterek jelenjenek meg a GET válaszban.
Használható értékek
text Szabad szavas
textmore Szabad szavas, többértékű (TAG)
enum Értékkészlet
enummore Értékkészlet, többértékű
num Szám
interval Intervallum
color Szín
color_text Szín és szöveg
link Link
linkblank Link, új ablakban megnyitva
link_text Szöveges link
html HTML
icon Ikon
iconmore Ikon, többértékű
pic Kép
piclink Kép fájlkezelőből
piclinktext Kép fájlkezelőből alternatív szöveggel
date Dátum
cust_input_text Szövegbeviteli mező a termék részletek oldalon
cust_input_select Legördülő menü a termék részletek oldalon
cust_input_file Fájlfeltöltő mező a termék részletek oldalon
Lang   string
Adott paraméterhez mentett vásárló felületi nyelvhez kötött tartalom. Ha nem létezik a kívánt nyelven tartalom, akkor az alap nyelvű szöveg jelenik meg a GET válaszban.
getProductParameter válasz
A getProductParameter kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setProductParameter kérés
A setProductParameter kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setProductParameter válasz
A setProductParameter válaszban láthatod az információkat a módosított, létrehozott illetve törölt termék paraméterekről. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbi lehet.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A termék paraméterek kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getProductParameter kérésre a választ, illetve ilyen formában kell beküldened a setProductParameter kérést. Az egyes mezőkhöz külön található leírás is, továbbá feltüntetjük azt, hogy melyik adattag használható a getProductParameter illetve setProductParameter végpontokhoz, GET illetve SET jelöléssel.
Action   enum SET
Az API híváshoz tartozó művelet. Csak setProductParameter végpontnál használható.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A termék paraméter egyedi azonosítója. A setProductParameter végpont használatakor csak azonosításra szolgál.
Name   integer GET SET
A termék paraméter neve.
Type   enum GET SET
A termék paraméter típusa.
Használható értékek
text Szabad szavas
textmore Szabad szavas, többértékű (TAG)
enum Értékkészlet
enummore Értékkészlet, többértékű
num Szám
interval Intervallum
color Szín
color_text Szín és szöveg
link Link
linkblank Link, új ablakban megnyitva
link_text Szöveges link
html HTML
icon Ikon
iconmore Ikon, többértékű
pic Kép
piclink Kép fájlkezelőből
piclinktext Kép fájlkezelőből alternatív szöveggel
date Dátum
cust_input_text Szövegbeviteli mező a termék részletek oldalon
cust_input_select Legördülő menü a termék részletek oldalon
cust_input_file Fájlfeltöltő mező a termék részletek oldalon
Lang   string GET
A termék paraméterhez használt nyelv.
Group   string GET SET
A termék paramétereket csoportosíthatod az egyszerűbb kezelhetőség miatt, itt ezt az adattagot tudod kezelni.
Description   string GET SET
Termék paraméter rövid leírása.
Order   integer GET SET
Termék paraméter sorrend értéke.
Display   object GET SET
Megjelenésre, felhasználásra vonatkozó adatok.
Display.ProductList   enum GET SET
Adott paraméter a termék listában szerepelhet e vagy sem.
Használható értékek
yes no
Display.ProductDetails   enum GET SET
Adott paraméter termék részletek oldalon szerepelhet e vagy sem.
Használható értékek
yes igen
yes,top igen, kiemelt helyen
no nem
Display.OnlyLoggedIn   enum GET SET
Adott paraméter csak belépés után látható e vagy sem.
Használható értékek
yes no
Display.InStock   enum GET SET
Raktárkészlet függő megjelenítés.
Használható értékek
yes_in_stock Legyen raktárkészletfüggő a termék paraméter láthatósága, csak akkor jelenik meg, ha a termék van raktáron.
yes_out_of_stock Legyen raktárkészletfüggő a termék paraméter láthatósága, csak akkor jelenik meg, ha a termék nincs raktáron.
no Nem a raktárkészlettől függ a termék paraméter láthatósága.
Display.OrderFlow   enum GET SET
Megjelenjen e a megrendelési folyamatban.
Használható értékek
yes no
Display.OrderEmail   enum GET SET
Adott paraméter megjelenjen e a megrendelés értesítő e-mailben vagy sem.
Használható értékek
yes no
Display.OrderPrint   enum GET SET
Adott paraméter megjelenjen e a megrendelés nyomtatásban vagy sem.
Használható értékek
yes no
Display.ExportFeed   enum GET SET
Adott paraméter export feed-ekben szerepeljen e vagy sem.
Használható értékek
yes no
Display.AdminOrderList   enum GET SET
Adott paraméter a megrendelés listában megjelenjen e az adminisztrátori felületen.
Használható értékek
yes no
Display.AdminOrderDetails   enum GET SET
Megrendelés részletekben megjelenjen e az adminisztrátori felületen.
Használható értékek
yes no
Display.AdminOrderExport   enum GET SET
Megrendelés exportban látható legyen e a paraméter vagy sem.
Használható értékek
yes no
Display.AdminProductList   enum GET SET
Látható legyen a paraméter a termék listában az adminisztátori felületen.
Használható értékek
yes no
Display.AdminProductExport   enum GET SET
Paraméter a termék adatbázis exportban szerepeljen e vagy sem.
Használható értékek
yes no
Display.AdminCommissionList   enum GET SET
Megjelenjen e az összeszedési listában vagy sem.
Használható értékek
yes no
Display.OrderedProductsList   enum GET SET
Látható legyen e az összeszedési listában vagy sem.
Használható értékek
yes no
Usable   enum GET SET
Használati beállítások. Ebben a mezőben azt határozhatod meg, hogy mire használható a termék paraméter.
Usable.Compare   enum GET SET
A paraméter termékek összehasonlításához használható.
Használható értékek
yes no
Usable.Filter   enum GET SET
A paraméter használható szűréshez.
Használható értékek
yes,and Igen, ÉS kapcsolattal
yes,or Igen, VAGY kapcsolattal
no Nem
Usable.TypeHandling   enum GET SET
A paraméter használható termék összevonáshoz, típus kezeléshez.
Használható értékek
yes no
OrderAs   object GET SET
Termék szűrő boxban a válaszható értékek sorrendjére vonatkozó beállítás.
OrderAs.Type   enum GET SET
Termék szűrő boxban a válaszható szűrő paraméter értékek sorrendjét határozhatod meg.
Használható értékek
text Szövegként
num Számként
custom Egyedi sorrend alapján
OrderAs.Value   string GET SET
Egyedi értéksorrend esetében használható. Az értékek sorrendjét ebben a mezőben határozhatod meg.
BeforeText   string GET SET
A termék paraméter érték előtt megjelenő szöveg.
Az alábbi termék típusoknál használható
num Szám
intervall Intervallum
AfterText   string GET SET
A termék paraméter érték után megjelenő szöveg.
Az alábbi termék típusoknál használható
num Szám
intervall Intervallum
FilterStep   integer GET SET
A lépésköz mértéke.
Az alábbi termék típusoknál használható
num Szám
intervall Intervallum
EnumOptions   object GET SET
Értékkészlet típusú paraméterek esetén a választható opciók listája.
Az alábbi termék paraméter típusoknál használható, a gyerek elemeivel együtt
enum Értékkészlet
enummore Értékkészlet, többértékű
EnumOptions.Option   object GET SET
Az értékkészlet egy választható értéke.
Icons   object GET SET
Ikon típusú paraméterek esetén a választható képfájlokat tartalmazó mező.
Az alábbi termék paraméter típusoknál használható, a gyerek elemeivel együtt
icon Ikon
iconmore Ikon, többértékű
Icons.Icon   object GET SET
Egy ikont, képfájlt leíró mező.
Icons.Icon.Number   object GET SET
Ikon sorszáma.
Icons.Icon.Url   string GET SET
Ikon elérési URL-je.
Icons.Icon.Title   string GET SET
Az ikon Alt/Title HTML attribútuma.
Required   string GET SET
Kötelező-e a termék paraméter kitöltése.
Az alábbi termék típusoknál használható
cust_input_text Szövegbeviteli mező a termék részletek oldalon
cust_input_select Legördülő menü a termék részletek oldalon
cust_input_file Fájlfeltöltő mező a termék részletek oldalon
InputMaxlength   integer GET SET
Vásárló által kitölthető szövegbeviteli termék paraméterek esetében a tartalom maximális hossza.
Az alábbi termék típusnál használható
cust_input_text Szövegbeviteli mező a termék részletek oldalon
SelectOptions   object GET SET
Legördülő listából választható opciók..
SelectOptions.Option   string GET SET
Legördülő listából választható opció.
Az alábbi termék típusnál használható
cust_input_select Legördülő menü a termék részletek oldalon
Példák
Paraméter lekérdezése
Ebben a példában látható GET kéréssel az összes text típusú termék paramétert kérdezheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Type>text</Type>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ProductParameters>
	<ProductParameter>
		<Id>724311</Id>
		<Name><![CDATA[Méret]]></Name>
		<Type>text</Type>
		<Lang>hu</Lang>
		<Order>1</Order>
		<Display>
			<ProductList>no</ProductList>
			<ProductDetails>yes</ProductDetails>
			<OnlyLoggedIn>no</OnlyLoggedIn>
			<InStock>no</InStock>
			<OrderFlow>no</OrderFlow>
			<OrderEmail>no</OrderEmail>
			<OrderPrint>no</OrderPrint>
			<ExportFeed>yes</ExportFeed>
			<AdminOrderList>no</AdminOrderList>
			<AdminOrderDetails>no</AdminOrderDetails>
			<AdminOrderExport>no</AdminOrderExport>
			<AdminProductList>no</AdminProductList>
			<AdminProductExport>yes</AdminProductExport>
			<AdminCommissionList>no</AdminCommissionList>
			<OrderedProductsList>no</OrderedProductsList>
		</Display>
		<Usable>
			<Compare>yes</Compare>
			<Filter>yes,or</Filter>
			<TypeHandling>yes</TypeHandling>
		</Usable>
		<OrderAs>
			<Type>text</Type>
		</OrderAs>
	</ProductParameter>
</ProductParameters>


Paraméter létrehozása
A második példában egy SET kérést láthatsz: egy szín típusú termék paramétert hozhatsz létre az alábbi XML-lel.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<ProductParameters>
	<ProductParameter>
		<Action>add</Action>
		<Name><![CDATA[Szín]]></Name>
		<Type>color</Type>
		<Lang>hu</Lang>
		<Order>2</Order>
		<Display>
			<ProductList>no</ProductList>
			<ProductDetails>yes,top</ProductDetails>
			<OnlyLoggedIn>no</OnlyLoggedIn>
			<InStock>no</InStock>
			<OrderFlow>no</OrderFlow>
			<OrderEmail>no</OrderEmail>
			<OrderPrint>no</OrderPrint>
			<ExportFeed>yes</ExportFeed>
			<AdminOrderList>no</AdminOrderList>
			<AdminOrderDetails>no</AdminOrderDetails>
			<AdminOrderExport>no</AdminOrderExport>
			<AdminProductList>no</AdminProductList>
			<AdminProductExport>yes</AdminProductExport>
			<AdminCommissionList>no</AdminCommissionList>
			<OrderedProductsList>no</OrderedProductsList>
		</Display>
		<Usable>
			<Compare>no</Compare>
			<Filter>yes,and</Filter>
			<TypeHandling>yes</TypeHandling>
		</Usable>
		<OrderAs>
			<Type>text</Type>
		</OrderAs>
	</ProductParameter>
</ProductParameters>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ProductParameters>
	<ProductParameter>
		<Action>add</Action>
		<Id>724362</Id>
		<Status>ok</Status>
	</ProductParameter>
</ProductParameters>
Kategóriák
Áruházadban a termékek legalább egy kategóriában kell, hogy szerepeljenek. A kategóriák a termékektől teljesen független logikai egységek, saját névvel, képpel, szövegelemekkel stb. Az itt látható végpontok használatával az API-n keresztül ezen kategóriákat tudod kezelni: a többi entitáshoz hasonlóan létrehozni, módosítani, törölni tudod őket.
getCategory
Az getCategory végpont visszaadja a kérésben meghatározott feltételeknek megfelelő kategóriák adatait.
Végpont: https://api.unas.eu/shop/getCategory
A getCategory kérésben láthatod, hogy milyen módon lehet a kategóriákat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy kategória lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több kategória lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setCategory
A setCategory végpont segítségével különböző kategóriákat hozhatsz létre. Ezen felül ezzel tudod módosítani illetve törölni a kategóriákat.
Végpont: https://api.unas.eu/shop/setCategory
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setCategory kérést, melynek válaszát a setCategory válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 kategóriát tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 kategóriát tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getCategory kérés
GET kérésben határozhatod meg, milyen feltételek alapján szeretnéd a kategória információkat lekérni. A GET kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
Kategória egyedi azonosítója.
Name   string
Kategória neve.
Parent   integer
Szülőkategória azonosítója.
TimeStart   unix timestamp
Az ebben a mezőben meghatározott időpont után módosult kategóriák listázása.
TimeEnd   unix timestamp
Az ebben a mezőben meghatározott időpont előtt módosult kategóriák listázása.
DateStart   date
Az ebben a mezőben meghatározott dátum után módosult kategóriák listázása, elvárt formátum: YYYY.MM.DD.
DateEnd   date
Az ebben a mezőben meghatározott dátum előtt módosult kategóriák listázása, elvárt formátum: YYYY.MM.DD.
ContentType   enum
A kéréshez meghatározható adatlekérési szint, alapértelmezetten NORMAL szintű lekérés történik.
Használható értékek
minimal gyors lekérés, minimális kategória adatokkal
normal normál kategória lista, a leggyakrabban használt adatokkal
full teljes kategória lista, az összes kategória adattal. Abban az esetben érdemes ezt használni, ha tényleg minden kategória adatra szükséged van.
LimitNum  
Meghatározhatod, hogy mennyi kategóriát szeretnél listázni.
LimitStart  
Ha nem az összes kategóriát szeretnéd a GET válaszban szerepeltetni, itt határozhatod meg, hogy hányadik kategóriától induljon a letöltés. Pozitív egész szám, csak a LimitNum paraméterrel együtt használható.
History  
Lekérdezheted a kategória előzményeket.
Használható értékek
yes no
Lang   string
Meghatározhatod, hogy milyen nyelvű kategória adatokat szeretnél letölteni. A nyelvet az ISO 639-1 szabvány szerinti két karakteres kóddal kell meghatározni (pl.: hu, en, de). Az adatszerkezet fejezetben külön badge jelöli a nyelvek szempontjából kezelt adatokat.
getCategory válasz
A getCategory kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCategory kérés
A setCategory kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCategory válasz
A setCategory válaszban láthatod az információkat a módosított, létrehozott illetve törölt kategóriákról. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, melyek az alábbiak lehetnek.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A kategóriák kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getCategory kérésre a választ, illetve ilyen formában kell beküldened a setCategory kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük, hogy melyik adattag használható a getCategory illetve setCategory végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket. LANG jelöléssel láttuk el azokat az adatokat a leírásban, amelyeknél a kérés során különböző nyelveken is alkalmazható a lekérdezés és a módosítás. A Lang adatot setCategory kérés esetén az egyes Category node-okon belül kell elhelyezni.
Az egyes mezőknél a magyarázat mellett az is látható, hogy a konkrét adat milyen tartalmi szinten érhető el: minimal, normal vagy full. Itt csak a minimális elérési szinteket jelöljük, azaz ha egy adat elérhető például normal szinten, akkor ugyancsak szerepelni fog a válaszban full esetén is. Ha egy konkrét adatnál nincs külön jelölés, akkor az már minimal szinten is elérhető.
Action   SET enum
setCategory API hívás esetén a művelet típusa.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
State   enum GET
A kategória állapota.
Lehetséges értékek
live Létező kategória
deleted Törölt kategória
Id   integer GET SET
A kategória egyedi azonosítója. Automatikusan generált adat, setCategory funkció esetében csak azonosításra szolgál.
Name   string normal GET SET LANG
A kategória neve.
Url   string GET LANG
A kategória teljes URL-je.
SefUrl   string normal GET SET LANG
A kategóriához beállított keresőbarát URL.
AltUrl   string GET SET LANG
Alternatív URL, ha megadásra került, úgy a kategóriát ide irányítja át a rendszer a vásárló felületen.
AltUrlBlank   enum normal GET SET
Új ablakban nyíljon e meg az alternatív URL.
Megjelenő értékek
yes no
Display   object normal GET SET
Adott kategória hol legyen látható.
Display.Page   object GET SET
Kategória oldalon megjelenjen e a kategória vagy sem.
Használható értékek
yes no
Display.Menu   string GET SET
Kategória menüben megjelenjen e a kategória vagy sem.
Használható értékek
yes no
DisableFilter   string normal GET SET
Adott kategóriában a szűrő opció tiltva van-e vagy sem.
Használható értékek
yes no
PublicInterval   object GET SET
A kategória publikus időszaka.
PublicInterval.Start   string GET SET
A kategória publikus időszakának kezdeti dátuma. Elvárt formátum Y.m.d H:i:s
PublicInterval.End   string GET SET
A kategória publikus időszakának lejárati dátuma. Elvárt formátum Y.m.d H:i:s
NotVisibleInLanguage   object full GET SET
A kategória melyik áruházi nyelven nem elérhető.
NotVisibleInLanguage.Language   string full GET SET
A tiltott nyelv angol nyelvű megnevezése (pl. hungarian, english stb.).
PageLayout   object GET SET
A kategóriához tartozó egyedi oldal kinézet sablonok.
PageLayout.CategoryList   integer GET SET
Kategória oldalhoz tartozó egyedi kinézet sablon azonosítója.
PageLayout.ProductList   integer GET SET
Termék lista oldal egyedi sablon azonosítója.
Parent   integer GET SET
Szülő kategória adatok.
Parent.Id   integer GET SET
Szülő kategória egyedi azonosítója.
Parent.Tree   string normal GET SET LANG
Szülő kategória fa, "|" (pipe; bill. kombinációja AltGr + W) jelekkel elválasztva.
Order   integer GET SET
Egyedi sorrend érték.
Products   object GET
Termék adatok.
Products.All   integer GET
A kategóriában megtalálható összes termék száma.
Products.New   integer GET
A kategóriában megtalálható új termékek száma.
Texts   object normal GET SET
Kategória szövegek.
Texts.Top   string normal GET SET LANG
Kategória felett megjelenő szöveg.
Texts.Bottom   string normal GET SET LANG
Kategória alatt megjelenő szöveg.
Texts.Menu   string normal GET SET LANG
Kategória menüben látható szöveg.
Meta   object normal GET SET
Kategóriához tartozó meta adatok.
Meta.Keywords   string normal GET SET LANG
Kategóriához tartozó kulcsszó (keywords) meta tag tartalma.
Meta.Description   string normal GET SET LANG
Kategóriához tartozó leírás (description) meta tag tartalma.
Meta.Title   string normal GET SET LANG
Kategóriához tartozó cím (title) tag tartalma.
Meta.Robots   string normal GET SET
Kategóriához tartozó robots meta tag tartalma.
AutomaticMeta   string normal GET
Amennyiben nincs manuálisan beállított meta adat, úgy a rendszer az alapbeállítások szerint generál automatikus meta adatokat.
AutomaticMeta.Keywords   string normal GET SET
Automatikusan generált kulcsszó (keywords) tartalma.
AutomaticMeta.Description   string normal GET SET
Automatikusan generált leírás (description) tartalma.
AutomaticMeta.Title   string normal GET SET
Automatikusan generált cím (title) tartalma.
CreateTime   unix timestamp GET
A kategória létrehozásának időpontja időbélyeg (Unix timestamp) formátumban.
LastModTime   unix timestamp GET
A kategória utolsó módosításának időpontja időbélyeg (Unix timestamp) formátumban.
Image   object normal GET SET
Kategória kép adatok.
Image.Url   string normal GET
Kategória kép elérési URL.
Image.OG   string GET SET LANG
Kategória OG Image elérési URL.
Image.Version   string SET
Kép verzió. Csak setCategory végpontnál használható. A meglévő kép módosításakor értelmezett. Kérünk, hogy kép verziót valóban csak indokolt esetben küldj, azaz képet csak akkor cserélj az áruházban, ha az valóban változott, így elkerülhetők az alábbi limitációk!
Limitációk
Ha 5 alkalommal küldtél már kép verziót, azt követően hetente egyszer fogjuk csak feldolgozni a kép verzió frissítést.
Ha 10 alkalommal volt már kép verzió megadás, azt követően két hetente egyszer dolgozzuk fel a kérést.
Ha 15 alkalommal volt kép verzió megadva, havonta egyszer dolgozzuk fel kérést.
Ha 20 alkalom vagy annál többször, úgy pedig csak kéthavonta egyszer dolgozzuk fel a képfrissítési kérést.
A felsorolt limitációkat kategóriánként kell értelmezni.
Image.Import   object SET
Az importálandó kép. Csak setCategory végpontnál használható, időzítve töltjük át a képeket, ha még nincs kép rögzítve a termékhez.
Image.Import.Url   string SET
Az importálandó kép URL-je.
Tags   string full GET SET
Kategóriához tartozó címkék, melyekkel pl. szűrést lehet végezni kategória lista oldalakon.
Tags.Tag   string full GET SET LANG
A kategóriához tartozó címke.
History   object GET
Adott kategórián elvégzett műveletek egy hónapra visszamenőleg.
History.Event   object GET
Ez a mező egy kategóriához kapcsolódó eseményt ír le.
History.Event.Action   enum GET
A műveletet leíró mező.
Megjelenő értékek
add Hozzáadás
modify Módosítás
delete Törlés
History.Event.Time   GET unix time
Az esemény időpontja.
History.Event.Id   integer GET
A kategória egyedi azonosítója.
Példák
Kategória lekérése
Az alábbi példában egy getCategory kérést láthatsz. Az XML-ben látható, hogy a 2022.01.01. és 2022.03.01. között módosított kategóriák jelennek meg a válaszban, a kategóriák összes adatával - ezt a ContentType mező full értékével határozhatod meg.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<DateStart>2022.01.01</DateStart>
  	<DateEnd>2022.03.01</DateEnd>
  	<ContentType>full</ContentType>
</Params>


Válasz
Ebben a példában a getCategory válaszra láthatsz példát.
<?xml version="1.0" encoding="UTF-8" ?>
<Categories>
	<Category>		
		<Id>200000</Id>		
		<Name><![CDATA[Férfi divat]]></Name>
		<Url><![CDATA[https://design1600.unas.hu/ferfi-divat]]></Url>
		<SefUrl><![CDATA[ferfi-divat]]></SefUrl>
		<AltUrl><![CDATA[https://unas.hu]]></AltUrl>
		<AltUrlBlank>yes</AltUrlBlank>
		<Display>
			<Page>yes</Page>
			<Menu>yes</Menu>
		</Display>
		<PageLayout>
			<ProductList>2</ProductList>
			<CategoryList>2</CategoryList>
		</PageLayout>
		<Parent>
		    <Id>100000</Id>
		    <Tree><![CDATA[Divat|Ruha]]></Tree>
		</Parent> 
		<Order>2</Order>
		<Products>
			<All>5</All>
			<New>0</New>
		</Products>
		<Texts>
			<Top><![CDATA[<p>Kategória felett megjelenő szöveg</p>]]></Top>
			<Bottom><![CDATA[<p>Kategória alatt megjelenő szöveg</p>]]></Bottom>
			<Menu><![CDATA[Kategória menü szöveg]]></Menu>
		</Texts>
		<Meta>
			<Keywords><![CDATA[keywords]]></Keywords>
			<Description><![CDATA[description]]></Description>
			<Title><![CDATA[title]]></Title>
			<Robots>index, follow</Robots>
		</Meta>
		<AutomaticMeta>
		    <Keywords><![CDATA[általános kategória meta keyword]]></Keywords>
			<Description><![CDATA[általános kategória meta description]]></Description>
			<Title><![CDATA[általános kategória meta title]]></Title>
		</AutomaticMeta>
		<LastModTime>1644934977</LastModTime>
		<Image>
			<Url>https://shop.unas.hu/img/40712/catpic_238482/238482.jpg</Url>
			<OG>https://unas.hu/image.jpg</OG>
		</Image>
		<Tags>
		    <Tag>tag 1</Tag>
		    <Tag>tag 2</Tag>
		</Tags>
	</Category>	
</Categories>


Kategória létrehozása, módosítása
Az alábbi XML a setCategory kérést mutatja be, egy új kategória létrehozása látható a példában. Hasonlóan tudsz meglévő kategóriát módosítani is.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Categories>
	<Category>
		<Action>add</Action>		
		<Name><![CDATA[Női divat]]></Name>
		<Url><![CDATA[https://design1600.unas.hu/noi-divat]]></Url>
		<SefUrl><![CDATA[noi-divat]]></SefUrl>
		<AltUrl><![CDATA[https://unas.hu]]></AltUrl>
		<AltUrlBlank>yes</AltUrlBlank>
		<Display>
			<Page>yes</Page>
			<Menu>no</Menu>
		</Display>
		<Texts>
			<Top><![CDATA[<p>Kategória felett megjelenő szöveg</p>]]></Top>
			<Bottom><![CDATA[<p>Kategória alatt megjelenő szöveg</p>]]></Bottom>
			<Menu><![CDATA[Kategória menü szöveg]]></Menu>
		</Texts>
		<Meta>
			<Keywords><![CDATA[keywords]]></Keywords>
			<Description><![CDATA[ez lesz a kategória description]]></Description>
			<Title><![CDATA[A kategória title]]></Title>
			<Robots>index, follow</Robots>
		</Meta>		
		<Image>			
			<OG>https://unas.hu/image.jpg</OG>
		</Image>
		<Tags>
		    <Tag>tag 1</Tag>
		    <Tag>tag 2</Tag>
		</Tags>
	</Category>	
</Categories>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Categories>
	<Category>
		<Action>add</Action>
		<Id>903046</Id>
		<Status>ok</Status>
	</Category>
</Categories>
Vásárlók
Az áruházadban levő vásárlókat tudod kezelni, le lehet kérni a különböző regisztrált vásárlókhoz tartozó adatokat, de természetesen lehetőséged nyílik újak rögzítésére, valamint a meglévő adatok módosítására, akár törlésére is.
getCustomer
A getCustomer végponttal listázhatók az áruházba regisztrált vásárlók, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getCustomer
A getCustomer kérésben láthatod, hogy milyen módon lehet a vásárlókat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy vásárló lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több vásárló lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setCustomer
A setCustomer végpont használatával tudod a vásárlóidat létrehozni, módosítani illetve törölni a webáruházból.
Végpont: https://api.unas.eu/shop/setCustomer
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setCustomer kérést, melynek válaszát a setCustomer válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 vásárlót tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 vásárlót tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getCustomer kérés
getCustomer kérésben határozhatod meg, milyen feltételek alapján szeretnéd a vásárlókat listázni. A getCustomer kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
A vásárló egyedi azonosítója.
Email   string
A vásárló e-mail címe.
Username   string
A vásárló felhasználó neve, ha a funkció az adott áruházban aktív.
RegTimeStart   unix timestamp
Meghatározott időpont után regisztrált vásárlókat listázhatod.
RegTimeEnd   unix timestamp
Meghatározott időpont előtt regisztrált vásárlókat listázhatod.
ModTimeStart   unix timestamp
Meghatározott időpont után módosított vásárlókat listázhatod.
ModTimeEnd   unix timestamp
Meghatározott időpont előtt módosított vásárlókat listázhatod.
LoginTimeStart   unix timestamp
Meghatározott időpont után belépett vásárlókat listázhatod.
LoginTimeEnd   unix timestamp
Meghatározott időpont előtt belépett vásárlókat listázhatod.
LimitStart   integer
Ha nem az összes vásárlót szeretnéd listázni, megmondhatod, hányadik vásárlótól induljon a lekérés. Csak a LimitNum paraméterrel együtt használható.
LimitNum   unix timestamp
Meghatározható, hogy hány vásárlót listázzon a getCustomer végpont.
getCustomer válasz
A getCustomer kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCustomer kérés
A setCustomer kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCustomer válasz
A setCustomer válaszban láthatod az információkat a módosított, létrehozott illetve törölt vásárlókról. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, melyek az alábbiak lehetnek.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A vásárlók kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getCustomer kérésre a választ, illetve ilyen formában kell beküldened a setCustomer kérést. Az egyes mezőkhöz külön található leírás is, továbbá feltüntetjük azt, hogy melyik adattag használható a getCustomer illetve setCustomer végpontokhoz, GET illetve SET jelöléssel.
Action   enum SET
A setCustomer kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A vásárló egyedi azonosítója. SET esetén csak azonosító adatként használható, nem módosítható.
Email   string GET SET
A vásárló e-mail címe. SET esetén csak azonosító adatként használható, nem módosítható.
EmailWarning   string GET
Ha az email cím nem létezik, vagy a létezését nem lehetett ellenőrizni, akkor node értéke 1.
Username   string GET SET
A vásárló felhasználóneve. Csak akkor használható, ha a felhasználónév funkció aktív az áruházban. SET esetén csak azonosító adatként használható, nem módosítható.
Password   string SET
A felhasználó kódolatlan jelszava.
PasswordCrypted   string SET
A felhasználó kódolt jelszava, bcrypt kódolással. Csak akkor használjuk fel, ha a Password mező üres.
Contact   object GET SET
A vásárlóhoz tartozó kapcsolati adatokat tartalmazó mező.
Contact.Name   string GET SET
Kapcsolattartó neve.
Contact.Phone   string GET SET
Kapcsolattartó telefonszáma.
Contact.Mobile   string GET SET
Kapcsolattartó mobiltelefon száma.
Contact.Lang   string GET SET
Használt nyelv.
Addresses   object GET SET
A vásárló számlázási, szállítási és további címeit tartalmazó mező.
Addresses.Invoice   object GET SET
A vásárló számlázási címe.
Addresses.Invoice.Name   string GET SET
A számlázási címhez tartozó név.
Addresses.Invoice.ZIP   string GET SET
A számlázási címhez tartozó irányító szám.
Addresses.Invoice.City   string GET SET
A számlázási címhez tartozó város.
Addresses.Invoice.Street   string GET SET
A pontos számlázási cím.
Addresses.Invoice.StreetName   string GET SET
Közterület neve.
Addresses.Invoice.StreetType   string GET SET
Közterület jellege.
Addresses.Invoice.StreetNumber   string GET SET
Házszám, emelet ajtó stb.
Addresses.Invoice.County   string GET SET
A számlázási címhez tartozó megye.
Addresses.Invoice.Country   string GET SET
A számlázási címhez tartozó ország.
Addresses.Invoice.CountryCode   string GET SET
A számlázási címhez tartozó országkód.
Addresses.Invoice.TaxNumber   string GET SET
A vásárló adott címhez tartozó adószáma.
Addresses.Invoice.EUTaxNumber   string GET SET
A vásárló adott címhez tartozó EU adószáma.
Addresses.Invoice.CustomerType   enum GET SET
A vásárló adott címhez tartozó típusa.
Használható értékek
private Magánszemély
company Cég
other_customer_without_tax_number Egyéb, adószámmal nem rendelkező vásárló - használata áruházi beállítástól is függ!
Addresses.Shipping   object GET SET
A vásárló szállítási címe.
Addresses.Shipping.Name   string GET SET
A szállítási címhez tartozó név.
Addresses.Shipping.ZIP   string GET SET
A szállítási címhez tartozó irányítószám.
Addresses.Shipping.City   string GET SET
A szállítási címhez tartozó város.
Addresses.Shipping.Street   string GET SET
A pontos szállítási cím.
Addresses.Shipping.StreetName   string GET SET
Szállítási címhez tartozó közterület neve.
Addresses.Shipping.StreetType   string GET SET
Szállítási címhez tartozó közterület jellege.
Addresses.Shipping.StreetNumber   string GET SET
Szállítási címhez tartozó házszám, emelet, ajtó.
Addresses.Shipping.County   string GET SET
A szállítási címhez tartozó megye.
Addresses.Shipping.Country   string GET SET
A szállítási címhez tartozó ország.
Addresses.Shipping.CountryCode   string GET SET
A szállítási címhez tartozó ország kódja.
Addresses.Shipping.TaxNumber   string GET SET
A vásárló adott címhez tartozó adószáma.
Addresses.Shipping.EUTaxNumber   string GET SET
A vásárló adott címhez tartozó EU adószáma.
Addresses.Shipping.CustomerType   enum GET SET
A vásárló adott címhez tartozó típusa.
Használható értékek
private Magánszemély
company Cég
other_customer_without_tax_number Egyéb, adószámmal nem rendelkező vásárló - használata áruházi beállítástól is függ!
Addresses.Other   object GET SET
A vásárló további címei, áruházi beállítástól is függ a használata. Bekapcsolt esetben korlátlan számú további cím létrehozható.
Addresses.Other.Id   string GET
A további címhez tartozó azonosító.
Addresses.Other.Name   string GET SET
A további címhez tartozó név.
Addresses.Other.ZIP   string GET SET
A további címhez tartozó irányítószám.
Addresses.Other.City   string GET SET
A további címhez tartozó város.
Addresses.Other.Street   string GET SET
A további címhez tartozó utca, házszám.
Addresses.Other.County   string GET SET
A további címhez tartozó megye.
Addresses.Other.Country   string GET SET
A további címhez tartozó ország.
Addresses.Other.CountryCode   string GET SET
A további címhez tartozó országkód.
Addresses.Other.TaxNumber   string GET SET
A vásárló adott címhez tartozó adószáma.
Addresses.Other.EUTaxNumber   string GET SET
A vásárló adott címhez tartozó EU adószáma.
Addresses.Other.CustomerType   enum GET SET
A vásárló adott címhez tartozó típusa.
Használható értékek
private Magánszemély
company Cég
other_customer_without_tax_number Egyéb, adószámmal nem rendelkező vásárló - használata áruházi beállítástól is függ!
Params   object GET SET
A vásárlóhoz tartozó plusz paraméterek, melyben a törzs adatokon felül további információk szerepelhetnek a vásárlóról. Vásárló felületen regisztráció illetve adatmódosítás során kérhetők be ezen információk.
Params.Param   object GET SET
Egy vásárló paramétert leíró mező.
Params.Param.Id   integer GET SET
A vásárló paraméter egyedi azonosítója.
Params.Param.Name   string GET SET
A vásárló paraméter neve.
Params.Param.Value   string GET SET
A vásárló paraméter értéke.
Dates   object GET
Vásárlóhoz kapcsolódó időpontok.
Dates.Registration   date GET SET
Regisztráció időpontja, létrehozáskor használható a setCustomer kérésben.
Dates.Modification   date GET
Utolsó módosítás időpontja.
Dates.Login   date GET
Utolsó belépés időpontja.
Group   object GET SET
A vásárlóhoz csoport adatai, ha a vásárló tartozik valamelyik vásárló csoportba.
Group.Id   integer GET SET
A vásárló csoport egyedi azonosítója.
Group.Name   string GET SET
A vásárló csoport neve.
Group.ForeignID   integer GET
Vásárló csoport külső azonosítója.
Authorize   object GET SET
A vásárlóhoz tartozó jogosultságokat leíró mező.
Authorize.Customer   enum GET SET
Megmutatja, hogy a vásárló visszaigazolta e a regisztrációt vagy sem. Ez az érték módosítható a setCustomer végpont segítségével.
Használható értékek
yes no
Authorize.Admin   enum GET SET
Megmutatja, hogy az adminisztrátor engedélyezte e a belépést vagy sem. Ez az érték módosítható a setCustomer végpont segítségével.
Használható értékek
yes no
Discount   object GET SET
A vásárló kedvezményeket leíró mező.
Discount.Total   float GET SET
A vásárló százalékos végösszeg kedvezménye, a beállítható érték 0 és 100 közötti.
Discount.Direct   float GET SET
A vásárló százalékos közvetlen termék kedvezménye, a beállítható érték 0 és 100 közötti.
PointsAccount   object GET SET
A vásárló pont egyenlegét leíró mező.
PointsAccount.Balance   float GET SET
A vásárló pont egyenlege.
Newsletter   object GET SET
A vásárló hírlevéllel kapcsolatos beállításait leíró mező.
Newsletter.Subscribed   enum GET SET
Megmutatja, hogy a vásárló feliratkozott e hírlevélre.
Használható értékek
yes no
Newsletter.Authorized   enum GET SET
Megmutatja, hogy a vásárló megerősítette e feliratkozását.
Használható értékek
yes no
Comment   string GET SET
Megjegyzés a vásárlóról, melyet a vásárló nem láthat.
Restrictions   object GET SET
Vásárlóhoz tartozó fizetési és szállítási mód tiltásokat leíró mező.
Restrictions.Restriction   object GET SET
Egy fizetési és szállítási mód tiltást leíró mező.
Restrictions.Restriction.Type   enum GET SET
A tiltott mód típusa.
Használható értékek
shipping_method Szállítási mód
payment_method Fizetési mód
Restrictions.Restriction.Id   integer GET SET
A tiltott szállítási vagy fizetési mód egyedi azonosítója.
Restrictions.Restriction.Name   string GET SET
A tiltott szállítási vagy fizetési mód neve.
Cards   object GET
Mentett (tárolt) bankkártyák adatait tartalmazó mező.
Cards.Card   object GET
Egy konkrét kártya adatait tartalmazó mező.
Cards.Card.PaymentModName   string GET
A mentett kártyához tartozó fizetési mód neve.
Cards.Card.Type   string GET
A mentett kártyához tartozó fizetési mód típusa.
AbandonedCart   object GET SET
Mentett (tárolt) kosár adatait tartalmazó mező.
AbandonedCart.Operation   string SET
A setCustomer kérés esetén a mentett kosár kapcsán végrehajtandó művelet.
Használható értékek
add Tételek hozzáadása a már meglévő kosárhoz
remove Tételek törlése a kosárból
replace Meglévő kosár felülírása az aktuálisan küldött tételekkel (alapértelmezett)
AbandonedCart.Items   object GET SET
Mentett (tárolt) kosár egyes tételeit tartalmazó mező.
AbandonedCart.Items.Item   object GET SET
Egy konkrét tétel adatait tartalmazó mező.
AbandonedCart.Items.Item.Sku   string GET SET
A tételhez tartozó cikkszám.
AbandonedCart.Items.Item.Quantity   float GET SET
A tételhez tartozó darabszám.
AbandonedCart.Items.Item.Variants   object GET SET
A tételhez tartozó változat információk (ha változattal rendelkezik a termék).
AbandonedCart.Items.Item.Variants.Variant   object GET SET
A konkrét változat információk.
AbandonedCart.Items.Item.Variants.Variant.Name   string GET SET
Az adott változat neve (pl. szín).
AbandonedCart.Items.Item.Variants.Variant.Value   string GET SET
Az adott változat értéke (pl. kék).
AbandonedCart.Items.Item.PlusService   object GET SET
A tételhez tartozó plusz szolgáltatás.
AbandonedCart.Items.Item.PlusService.Id   string GET SET
A tételhez tartozó plusz szolgáltatás azonosítója.
AbandonedCart.Items.Item.Params   object GET SET
A tételhez tartozó termék paraméter adatok (pl. vásárló által megadható szöveges érték).
AbandonedCart.Items.Item.Params.Param   object GET SET
A tételhez tartozó konkrét paraméter értékei.
AbandonedCart.Items.Item.Params.Param.Id   string GET SET
Az adott termék paraméter azonosítója.
AbandonedCart.Items.Item.Params.Param.Name   string GET SET
Az adott termék paraméter neve.
AbandonedCart.Items.Item.Params.Param.Value   string GET SET
Az adott termék paraméter értéke.
AbandonedCart.Items.Item.PackageOfferId   string GET SET
A tételhez tartozó csomagajánlat azonosítója (amennyiben a tétel csomagajánlat részét képezi a kosárban).
AbandonedCart.Items.Item.SubscriptionPeriod   string GET SET
A tételhez tartozó előfizetési időszak (amennyiben a tétel előfizetéssel került a kosárba).
AbandonedCart.Items.Item.Order   int GET SET
A tétel kosárbeli sorszáma.
Favourites   object GET SET
A kedvenc termékeket tartalmazó objektum.
Favourites.Operation   string SET
A setCustomer kérés esetén végrehajtandó művelet.
Használható értékek
add Termékek hozzáadása a már meglévő kedvencekhez
remove Termékek törlése a kedvencek közül
replace Kedvenc termékek felülírása az aktuálisan küldött termékekkel (alapértelmezett)
Favourites.Items   object GET SET
A kedvenc termékek listája.
Favourites.Items.Item   object GET SET
Egy kedvenc terméket tartalmazó objektum.
Favourites.Items.Item.Sku   string GET SET
Az adott kedvenc termék cikkszáma.
Others   object GET
Egyéb adatokat tartalmazó mező.
Others.FacebookConnect   enum GET
A vásárló használja a Facebook belépést vagy sem.
Használható értékek
yes no
Others.Ip   object GET
Regisztrációkor használt IP cím.
Others.Referer   object GET
Erről az oldalról érkezett a vásárló.
checkCustomer kérés
A kérésben egy XML-t adhatsz meg, melyben egy vásárló jelszóról kapsz információt az API válasza alapján, hogy helyes-e vagy sem. A funkció egy XML-lel tér vissza, amiben csak és kizárólag annyi szerepel, hogy helyes-e a jelszó vagy nem. Függően attól, hogy az áruházat hogyan állítottad be, email címmel vagy felhasználónévvel is tudod ellenőrizni a felhasználót.
Végpont: https://api.unas.eu/shop/checkCustomer
User   string
Ellenőrizni kívánt e-mail cím vagy felhasználónév.
Password   string
Ellenőrizni kívánt jelszó.
checkCustomer válasz
Result boolean
Sikeres válasz esetén true, sikertelen vagy nem létező felhasználói fiók esetén false érték.
Példák
Vásárló létrehozása
Az alábbi példa XML-lel egy vásárlót hozhatsz létre. A példában feltüntettük a vásárló szállítási címét, számlázási címét és egy további címet is. A számlázási adatokban látható, hogy egy cég típusú vásárlót hoz létre, ezt a CustomerType, a TaxNumber és az EUTaxNumber mezők értékein is láthatod. Kettő vásárló paramétert továbbá kedvezményeket is rendel a példakód a vásárlóhoz: a végösszeg kedvezmény 10%, míg a közvetlen termék kedvezmény 5% lesz.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Customers>
	<Customer>
		<Action>add</Action>
		<Email>pelda.felhasznalo@unas.hu</Email>
		<PasswordCrypt>$2a$12$GJW1ZJyVPcE24.zK1eqU3etl9qUY.mA/AXSFToLFP5c/.ezJYC8TC</PasswordCrypt>
		<Contact>
			<Name><![CDATA[Teszt Elek]]></Name>
			<Phone><![CDATA[+3699123456]]></Phone>
			<Mobile><![CDATA[+36301234567]]></Mobile>
			<Lang>hu</Lang> 
		</Contact>
		<Addresses>
			<Invoice>
				<Name><![CDATA[Unas Online Kft.]]></Name> 
				<ZIP>9400</ZIP>
				<City><![CDATA[Sopron]]></City>
				<Street><![CDATA[Kőszegi út 14.]]></Street>
				<StreetName><![CDATA[Kőszegi]]></StreetName>
				<StreetType><![CDATA[út]]></StreetType>
				<StreetNumber><![CDATA[1]]></StreetNumber>
				<County><![CDATA[Győr-Moson-Sopron]]></County>
				<Country>Magyarország</Country>
				<CountryCode>hu</CountryCode>
				<TaxNumber><![CDATA[1234568-0-00]]></TaxNumber>
				<EUTaxNumber><![CDATA[HU0123456789]]></EUTaxNumber>
				<CustomerType><![CDATA[company]]></CustomerType>
			</Invoice>
			<Shipping>
				<Name><![CDATA[Teszt Elek]]></Name>
				<ZIP>9400</ZIP>
				<City><![CDATA[Sopron]]></City>
				<Street><![CDATA[Kőszegi út 14.]]></Street>
				<StreetName><![CDATA[Kőszegi]]></StreetName>
				<StreetType><![CDATA[út]]></StreetType>
				<StreetNumber><![CDATA[14]]></StreetNumber>
				<County><![CDATA[Győr-Moson-Sopron]]></County>
				<Country>Magyarország</Country>
				<CountryCode>hu</CountryCode>
			</Shipping>
			<Other>
			    <Name><![CDATA[Teszt Elek]]></Name>
				<ZIP>9400</ZIP>
				<City><![CDATA[Sopron]]></City>
				<Street><![CDATA[Major köz 2.]]></Street>
				<County><![CDATA[Győr-Moson-Sopron]]></County>
				<Country>Magyarország</Country>
				<CountryCode>hu</CountryCode>
			</Other>            
		</Addresses>
		<Params>
			<Param>				
				<Id>1000</Id>				
				<Name><![CDATA[Paraméter 1 neve]]></Name>				
				<Value><![CDATA[Érték 1]]></Value>				
			</Param>
			<Param>				
				<Id>1001</Id>
				<Name><![CDATA[Paraméter 2 neve]]></Name>
				<Value><![CDATA[Érték 2]]></Value>
			</Param>
		</Params>
		<Discount>
			<Total>10</Total>			
			<Direct>5</Direct>			
		</Discount>
	</Customer>
</Customers>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Customers>
	<Customer>
		<Email>pelda.felhasznalo@unas.hu</Email>
		<Action>add</Action>
		<Id>41704472</Id>
		<Status>ok</Status>
	</Customer>
</Customers>


Vásárló módosítása
Az alábbi példa XML-lel egy vásárló adatait módosíthatod. A vásárló email címe gipsz.jakab@gmail.com, a módosítás során egy megjegyzés kerül beállításra a vásárlóhoz, ezen felül a pont egyenlege módosul 3520 pontra. Ezen felül két fizetési és két szállítási mód is tiltásra kerül.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Customers>
	<Customer>
	    <Action>modify</Action>
	    <Email><![CDATA[gipsz.jakab@gmail.com]]></Email>
		<Comment><![CDATA[Előző rendelését nem vette át.]]></Comment>
		<PointsAccount>
			<Balance>3520</Balance>
		</PointsAccount>
		<Restrictions>
			<Restriction>
				<Type>payment_method</Type>
				<Id>1000</Id>
				<Name><![CDATA[Utánvét]]></Name>
			</Restriction>
			<Restriction>
				<Type>payment_method</Type>
				<Id>2000</Id>
				<Name><![CDATA[Átutalás]]></Name>
			</Restriction>
			<Restriction>
				<Type>shipping_method</Type>
				<Id>3000</Id>
				<Name><![CDATA[Express futár]]></Name>
			</Restriction>
			<Restriction>
				<Type>shipping_method</Type>
				<Id>4000</Id>
				<Name><![CDATA[DPD futárszolgálat]]></Name>
			</Restriction>
		</Restrictions>
	</Customer>
</Customers>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Customers>
	<Customer>
		<Email>gipsz.jakab@gmail.com</Email>
		<Action>modify</Action>
		<Id>41704472</Id>
		<Status>ok</Status>
	</Customer>
</Customers>


Vásárló ellenőrzése
Az alábbi példa XML-lel egy vásárló jelszavát ellenőrizheted.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <User><![CDATA[teszt.elek@unas.hu]]></User>
    <Password>teszt</Password>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Result>true</Result>
Vásárló csoportok
Az áruházadban levő vásárló csoportokat tudod kezelni, le lehet kérni a különböző csoporthoz tartozó adatokat, de természetesen lehetőséged nyílik újak rögzítésére, valamint a meglévő adatok módosítására, akár törlésére is.
getCustomerGroup
A getCustomerGroup végponttal listázhatók az áruházban található vásárló csoport, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getCustomerGroup
A getCustomerGroup kérésben láthatod, hogy milyen módon lehet a csoportokat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy vásárló csoport lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több vásárló csoport lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setCustomerGroup
A setCustomerGroup végpont használatával tudod a csoportjaidat létrehozni, módosítani illetve törölni a webáruházból.
Végpont: https://api.unas.eu/shop/setCustomerGroup
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setCustomerGroup kérést, melynek válaszát a setCustomerGroup válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 vásárló csoportot tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 vásárló csoportot tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getCustomerGroup kérés
getCustomerGroup kérésben határozhatod meg, milyen feltételek alapján szeretnéd a vásárló csoportokat listázni. A getCustomerGroup kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
A vásárló csoport egyedi azonosítója.
Name   string
A vásárló csoport neve.
getCustomerGroup válasz
A getCustomerGroup kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCustomerGroup kérés
A setCustomerGroup kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCustomerGroup válasz
A setCustomerGroup válaszban láthatod az információkat a módosított, létrehozott illetve törölt vásárló csoportokról. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, melyek az alábbiak lehetnek.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A vásárló csoportok kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getCustomerGroup kérésre a választ, illetve ilyen formában kell beküldened a setCustomerGroup kérést. Az egyes mezőkhöz külön található leírás is, továbbá feltüntetjük azt, hogy melyik adattag használható a getCustomerGroup illetve setCustomerGroup végpontokhoz, GET illetve SET jelöléssel.
Action   enum SET
A setCustomerGroup kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A vásárló csoport egyedi azonosítója. SET esetén csak azonosító adatként használható, nem módosítható.
Name   string GET SET
A vásárló csoport neve.
VisibleForCustomers   string GET SET
A vásárló csoport láthatósági beállítása, azaz megjelenik e a csoport a vásárló felületen vagy sem.
Használható értékek
yes no
DiscountAmount   string GET SET
A megrendelés végösszegből adott kedvezmény mértéke, amennyiben a vásárló ezen csoport tagja.
DiscountProduct   string GET SET
Közvetlenül a termékek árából adott kedvezmény mértéke, amennyiben a vásárló ezen csoport tagja.
MinOrderValue   string GET SET
A csoporthoz rögzített minimális rendelési küszöb.
DiscountBasedOnActualOrder   string GET SET
A csoport tagja kaphat e egy adott rendelés végösszege alapján kedvezményt vagy sem.
Használható értékek
yes no
DiscountBasedOnAllOrders   string GET SET
A csoport tagja kaphat e az összes korábbi rendelése alapján kedvezményt vagy sem.
Használható értékek
yes no
WithoutVAT   object GET SET
A csoportra vonatkozó ÁFA mentességi szabályok, beállítások.
WithoutVAT.Value   string GET SET
A beállítás értéke.
Használható értékek
yes no
WithoutVAT.Reason   string GET SET
Adómentesség oka.
Használható értékek
other Egyéb
EU Export EU-n belülre
outside EU Export EU-n kívülre
DiscountByQuantity   string GET SET
A csoport tagja kaphat e mennyiségi kedvezményt vagy sem.
Használható értékek
yes no
DiscountFromSalePrice   string GET SET
A csoport tagja kaphat e kedvezményt vagy sem akciós ár esetén.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
DisableSalePrices   string GET SET
Akciós árak megjelenítésének ki- és bekapcsolása.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
ShowStock   string GET SET
Készlet kijelzés megjelenítésének ki- és bekapcsolása.
Használható értékek
yes Igen
yes with labels Igen, "VAN" vagy "NINCS" megjelenítéssel
yes, except without stock Igen, kivéve ha nincs raktáron a termék
no Nem
default Áruházi alapbeállítás
DisplayBasePriceWithFurtherPrice   string GET SET
Ha egy terméknél van további ár, megjelenjen e mellette a normál alapár is vagy sem.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
EmailReadOnly   string GET SET
Vásárló módosíthassa az email címét vagy sem.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
UsernameReadOnly   string GET SET
Vásárló módosíthassa a felhasználónevét vagy sem (ha használatban van az áruházban).
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
ShippingAddressReadOnly   string GET SET
Vásárló szállítási címe nem módosítható, csak olvasható.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
BillingAddressReadOnly   string GET SET
Vásárló számlázási címe nem módosítható, csak olvasható.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
UseVirtualMoney   string GET SET
Pontgyűjtés használata az adott vásárló csoport tagjainál.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
UseCoupon   string GET SET
Kuponrendszer használata az adott vásárló csoport tagjainál.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
UseVirtualMoney   string GET SET
Pontgyűjtés használata az adott vásárló csoport tagjainál.
Használható értékek
yes Igen
no Nem
default Áruházi alapbeállítás
DefaultShippingCost   string GET SET
Ha a vásárló még nem választott, melyik szállítási módhoz rögzített költség alapján számítsa a rendszer a szállítási költséget.
DefaultCurrency   string GET SET
Vásárló belépése után erre a pénznemre váltson automatikusan a rendszer.
ForeignKey   string GET SET
Vásárló csoporthoz rögzített külső azonosító.
Példák
Vásárló csoport adatlekérés
Az alábbi példa XML-lel egy vásárló csoport adatait kérheted le a csoport neve alapján.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Name><![CDATA[Belföldi viszonteladók]]></Name>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerGroups>
	<CustomerGroup>
		<Id>8647</Id>
		<Name><![CDATA[Belföldi viszonteladók]]></Name>
		<VisibleForCustomers>no</VisibleForCustomers>
		<DiscountAmount>0</DiscountAmount>
		<DiscountProduct>1</DiscountProduct>
		<MinOrderValue>1500</MinOrderValue>
		<DiscountBasedOnActualOrder>yes</DiscountBasedOnActualOrder>
		<DiscountBasedOnAllOrders>yes</DiscountBasedOnAllOrders>
		<WithoutVAT>
			<Value>yes</Value>
			<Reason>other</Reason>
		</WithoutVAT>
		<DiscountByQuantity>yes</DiscountByQuantity>
		<DiscountFromSalePrice>yes</DiscountFromSalePrice>
		<DisableSalePrices>yes</DisableSalePrices>
		<ShowStock>yes</ShowStock>
		<DisplayBasePriceWithFurtherPrice>yes</DisplayBasePriceWithFurtherPrice>
		<EmailReadOnly>yes</EmailReadOnly>
		<UsernameReadOnly>yes</UsernameReadOnly>
		<ShippingAddressReadOnly>yes</ShippingAddressReadOnly>
		<BillingAddressReadOnly>yes</BillingAddressReadOnly>
		<UseVirtualMoney>yes</UseVirtualMoney>
		<UseCoupon>yes</UseCoupon>
		<DefaultShippingCost><![CDATA[MPL]]></DefaultShippingCost>
		<DefaultCurrency>HUF</DefaultCurrency>
		<ForeignKey><![CDATA[00001]]></ForeignKey>
	</CustomerGroup>
</CustomerGroups>


Vásárló csoport létrehozása
Az alábbi példa XML-lel egy vásárló csoportot hozhatsz létre. A példa egy külföldi viszonteladók csoportot hoz létre, tagjai adómentesen vásárolhatnak, megadásra kerül többek között minimális rendelési összeg, 10%-os kedvezmények, valamint belépés utáni automatikus Euró devizára váltás.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerGroups>
	<CustomerGroup>
		<Name><![CDATA[Külföldi viszonteladók]]></Name>
		<VisibleForCustomers>no</VisibleForCustomers>
		<DiscountAmount>10</DiscountAmount>
		<DiscountProduct>10</DiscountProduct>
		<MinOrderValue>1000</MinOrderValue>
		<DiscountBasedOnActualOrder>yes</DiscountBasedOnActualOrder>
		<DiscountBasedOnAllOrders>yes</DiscountBasedOnAllOrders>
		<WithoutVAT>
			<Value>yes</Value>
			<Reason>EU</Reason>
		</WithoutVAT>
		<DiscountByQuantity>yes</DiscountByQuantity>
		<DiscountFromSalePrice>yes</DiscountFromSalePrice>
		<DisableSalePrices>no</DisableSalePrices>
		<ShowStock>yes</ShowStock>
		<DisplayBasePriceWithFurtherPrice>yes</DisplayBasePriceWithFurtherPrice>
		<EmailReadOnly>yes</EmailReadOnly>
		<UsernameReadOnly>yes</UsernameReadOnly>
		<ShippingAddressReadOnly>no</ShippingAddressReadOnly>
		<BillingAddressReadOnly>no</BillingAddressReadOnly>
		<UseVirtualMoney>yes</UseVirtualMoney>
		<UseCoupon>yes</UseCoupon>
		<DefaultShippingCost><![CDATA[GLS]]></DefaultShippingCost>
		<DefaultCurrency>EUR</DefaultCurrency>
		<ForeignKey><![CDATA[00001]]></ForeignKey>
	</CustomerGroup>
</CustomerGroups>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerGroups>
	<CustomerGroup>
		<Action>add</Action>
		<Id>1112683</Id>
		<Status>ok</Status>
	</CustomerGroup>
</CustomerGroups>


Vásárló csoport módosítása
Az alábbi példa XML-lel egy vásárló csoport adatait módosíthatod. A belföldi viszonteladók csoportjában kerülnek beállításra a kedvezmények és a minimum vásárlási összeg értékek.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerGroups>
	<CustomerGroup>
        <Id>1234567</Id>
		<Name><![CDATA[Belföldi viszonteladók]]></Name>
		<VisibleForCustomers>no</VisibleForCustomers>
		<DiscountAmount>15</DiscountAmount>
		<DiscountProduct>15</DiscountProduct>
		<MinOrderValue>10000</MinOrderValue>
	</CustomerGroup>
</CustomerGroups>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerGroups>
	<CustomerGroup>
		<Id>1234567</Id>
		<Action>modify</Action>
		<Status>ok</Status>
	</CustomerGroup>
</CustomerGroups>
Hírlevél feliratkozók
Az áruházban kezelt hírlevél feliratkozókat tudod kezelni az alábbi funkciókkal. Le tudod kérdezni a korábban feliratkozottak adatait valamint a set végpont segítségével módosítást tudsz végrehajtani vagy akár újabb feliratkozókat tudsz a rendszerhez adni.
getNewsletter
Az getNewsletter végpont visszaadja a kérésben meghatározott feltételeknek megfelelő hírlevél feliratkozók adatait.
Végpont: https://api.unas.eu/shop/getNewsletter
A getNewsletter kérésben láthatod, hogy milyen módon lehet a feliratkozókat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setNewsletter
A setNewsletter végpont segítségével kezelheted a feliratkozóidat. Ezzel a végponttal tudod módosítani illetve törölni a feliratkozásokat, valamint új feliratkozókat is tudsz megadni.
Végpont: https://api.unas.eu/shop/setNewsletter
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setNewsletter kérést, melynek válaszát a setNewsletter válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getNewsletter kérés
getNewsletter kérésben határozhatod meg, milyen feltételek alapján szeretnéd a feliratkozókat listázni. A getNewsletter kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Type   enum
Feliratkozó típusa.
Használható értékek
subscriber Feliratkozó
customer Vásárló
Auth   enum
A feliratkozás állapotára utal, egyes rendszerek "double opt-in"-ként hivatkoznak erre az adatra - valójában a megerősítésre vonatkozik.
Használható értékek
yes vagy 1 Megerősítette feliratkozását
no vagy 0 Nem erősítette meg feliratkozását
TimeStart   unix timestamp
Ezen időpont után feliratkozott igénylőket listázhatod ezzel a szűrő feltétellel.
TimeEnd   unix timestamp
Ezen időpont előtt feliratkozott igénylőket listázhatod ezzel a szűrő feltétellel.
Email   string
Konkrét email cím ellenőrzése, lekérése a rendszerből.
getNewsletter válasz
A getNewsletter kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setNewsletter kérés
A setNewsletter kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setNewsletter válasz
A setNewsletter válaszban láthatod az információkat a módosított, létrehozott illetve törölt hírlevél feliratkozókról. A végpont az alábbi adattagokkal dolgozik.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, melynek lehetséges értékei:
add Hozzáadás
modify Módosítás
delete Törlés
Email   string
Feliratkozó email címe.
Type   enum
Feliratkozás aktuális állapota.
Megjelenő értékek
subscriber Feliratkozó
customer Vásárló
Status   enum
Az API hívás státusza, mely lehet sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A hírlevél feliratkozók kezeléséhez az itt látható adatszerkezetnek megfelelően kapod a getNewsletter kérésre a választ, illetve ilyen formában kell beküldened a setNewsletter kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük azt, hogy melyik adattag használható a getNewsletter illetve setNewsletter végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setNewsletter kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Email   string GET SET
A feliratkozó e-mail címe.
Type   enum GET
A feliratkozó típusa.
Megjelenő értékek
subscriber Feliratkozó
customer Vásárló
Time   enum GET
A feliratkozás időpontja.
Name   string GET SET
A feliratkozó neve. Akkor használható ez a mező, ha az áruházban a feliratkozásnál a feliratkozó neve is használatban van.
Address   string GET SET
A feliratkozó címe. Akkor használható ez a mező, ha az áruházban a feliratkozásnál a feliratkozó címe is használatban van.
Lang   string GET SET
Használt nyelv.
Authorized   enum GET SET
Feliratkozás megerősítése.
Megjelenő értékek
yes no
Példák
Feliratkozó adatok lekérése
A példa az összes olyan adatot kéri le, akik a hírlevélre feliratkoztak, de még nem erősítették meg a feliratkozásukat.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Type>customer</Type>
    <Auth>no</Auth>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Subscribers>
	<Subscriber>
		<Email><![CDATA[teszt.elek@gmail.com]]></Email>
		<Type>customer</Type>
		<Name><![CDATA[Teszt Elek]]></Name>
		<Lang>hu</Lang>
		<Authorized>no</Authorized>
	</Subscriber>
	<Subscriber>
		<Email><![CDATA[gipsz.jakab@gmail.com]]></Email>
		<Type>customer</Type>
		<Name><![CDATA[Gipsz Jakab]]></Name>
		<Lang>hu</Lang>
		<Authorized>no</Authorized>
	</Subscriber>
</Subscribers>


Feliratkozó módosítása
Ebben a példában két feliratkozó hírlevélre való feliratkozásának megerősítése történik.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Subscribers>
	<Subscriber>
	    <Action>modify</Action>
		<Email><![CDATA[teszt.elek@gmail.com]]></Email>
		<Authorized>yes</Authorized>
	</Subscriber>
	<Subscriber>
	    <Action>modify</Action>
		<Email><![CDATA[gipsz.jakab@gmail.com]]></Email>
		<Authorized>yes</Authorized>
	</Subscriber>
</Subscribers>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Subscribers>
	<Subscriber>
		<Email>teszt.elek@gmail.com</Email>
		<Action>modify</Action>
		<Type>Customer</Type>
		<Status>ok</Status>
	</Subscriber>
	<Subscriber>
		<Email>gipsz.jakab@gmail.com</Email>
		<Action>modify</Action>
		<Type>Customer</Type>
		<Status>ok</Status>
	</Subscriber>
</Subscribers>
Scriptek
A rendszerbe integrált különböző külső rendszerek használatán felül lehetőséged van egyénileg is összekötni áruházad tetszőleges alkalmazással. Az áruházad vásárló felületére szkripteket, kódrészleteket helyezhetsz el, így tetszőleges módon tudsz adatokat kinyerni a rendszerből, követheted vásárlóit, látogatóid viselkedését valamint a különböző külső programok által biztosított kódon keresztül adatokat tudsz prezentálni az áruházadról a külső rendszerek felé, így nyomon követve az áruház működését.
getScriptTag
Az getScriptTag végpont visszaadja a kérésben meghatározott feltételeknek megfelelő script-ek adatait.
Végpont: https://api.unas.eu/shop/getScriptTag
A getScriptTag kérésben láthatod, hogy milyen módon lehet a vásárlókat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setScriptTag
A setScriptTag végpont segítségével különböző szkripteket szúrhatsz be a webáruházadba. Ezen felül így tudod módosítani illetve törölni a már meglévő szkripteket is.
Végpont: https://api.unas.eu/shop/setScriptTag
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setScriptTag kérést, melynek válaszát a setScriptTag válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getScriptTag kérés
getScriptTag kérésben listázhatod az áruházban már meglévő scripteket. A kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz.
Id   integer
A script egyedi azonosítója.
getScriptTag válasz
A getScriptTag kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setScriptTag kérés
A setScriptTag kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setScriptTag válasz
A setScriptTag válaszban láthatod az információkat a módosított, létrehozott illetve törölt scriptekről. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező. Az alábbi műveletekről kaphatsz visszajelzést az API válaszban.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza. Sikeres vagy sikertelen lehet egy API hívás.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A scriptek kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getScriptTag kérésre a választ, illetve ilyen formában kell beküldened a setScriptTag kérést. Az egyes mezőkhöz külön található leírás, feltüntetjük, hogy melyik adattag használható a getScriptTag illetve setScriptTag végpontokhoz. GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setScriptTag kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A script egyedi azonosítója. A SET végpontnál csak azonosító adatként használható, nem módosítható.
Status   enum GET SET
Megmutatja, hogy egy script aktív-e vagy sem. Használatával tudod állítani is a script ezen értékét.
Használható értékek
active inactive
Dates   object GET
A scripttel kapcsolatos időpontokat tartalmazó mező.
Dates.Creation   date GET
A script létrehozásának időpontja.
Dates.Modification   date GET
A script utolsó módosításának időpontja.
Pages   object GET SET
Meghatározható, hogy mely oldalakon jelenjen meg a script.
Pages.Page   object GET SET
Egy oldalt leíró mező.
Pages.Page.Id   enum GET SET
Az oldal azonosítója.
Használható értékek
start Főoldal
category Kategória oldal
product_list Termék lista
product_details Termék részletek
cart Kosár oldal
order_mods Fizetési és szállítási módok kiválasztása oldal
order_control Megrendelés ellenőrzése
order_send Megrendelés köszönő oldal
order_checkout Megrendelés kifizetése
Languages   object GET SET
Meghatározható, hogy mely nyelveken jelenjen meg a script.
Languages.Language   string GET SET
Nyelv kódja
Type   enum GET SET
A script típusa, mellyel azt tudod meghatározni, hogy a script hol helyezkedjen el az oldaladon.
Használható értékek
head a [HEAD] záró tag előtt
body_start a [BODY] nyitó tag után
body_end a [BODY] záró tag előtt
src külső SCRIPT URL-en
Title   string GET SET
A script elnevezése.
Content   string GET SET
A script tartalma, src típus esetén a script URL-jét szükséges megadni, egyéb esetben magát a kódot, nyitó és záró script tag-ek nélkül.
Szkript lekérése
Az áruházba korábban feltöltött vagy ott létrehozott szkripteket lehet lekérni az alábbihoz hasonló módon. A példa egy konkrét szkriptet kér le azonosító alapján.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>9752</Id>
</Params>

Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ScriptTags>
	<ScriptTag>
		<Id>9752</Id>
		<Status>inactive</Status>
		<Dates>
			<Creation>2022.04.14 14:25:26</Creation>
			<Modification>2022.04.14 14:25:26</Modification>
		</Dates>
		<Pages>
			<Page>
				<Id>cart</Id>
			</Page>
		</Pages>
		<Type>body_end</Type>
		<Title><![CDATA[Teszt script]]></Title>
		<Content><![CDATA[console.log("Ez lesz a script ami lefut a beállított oldalakon.")]]></Content>
	</ScriptTag>
</ScriptTags>

Szkript módosítása
Az alábbi példával szkript módosítását lehet elvégezni. A szerkesztés után már nem csak a kosár oldalon, hanem a fizetési és szállítási módválasztó oldalon illetve a megrendelés köszönő oldalon is elérhető lesz a script, aktívként.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<ScriptTags> 
    <ScriptTag>
        <Action>modify</Action>
	<Id>9752</Id>
        <Status>active</Status>
        <Pages>
            <Page>
                <Id>cart</Id>
            </Page>
            <Page>
                <Id>order_mods</Id>
            </Page>
            <Page>
                <Id>order_send</Id>
            </Page>
        </Pages>
        <Type>body_end</Type>
        <Title><![CDATA[Teszt script]]></Title>
        <Content><![CDATA[console.log("Ez lesz a script ami lefut a beállított oldalakon.")]]></Content>
    </ScriptTag>
</ScriptTags>

Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ScriptTags>
	<ScriptTag>
		<Action>modify</Action>
		<Id>9752</Id>
		<Status>ok</Status>
	</ScriptTag>
</ScriptTags>
Plusz menük, oldalak
A plusz oldalak, menük kezeléséhez használatos funkció. A GET végpont segítségével le tudod kérdezni a már létrehozott oldalakat, menüket, a SET használatával módosítani, törölni vagy épp létrehozni tudsz plusz oldalt, menüt.
getPage
A getPage végponttal listázhatók az áruházban létrehozott plusz oldalak, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getPage
A getPage kérésben láthatod, hogy milyen módon lehet a plusz menüket listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setPage
A setPage végpont használatával tudsz létrehozni, módosítani illetve törölni plusz oldalakat.
Végpont: https://api.unas.eu/shop/setPage
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setPage kérést, melynek válaszát a setPage válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getPage kérés
getPage kérésben határozhatod meg, milyen feltételek alapján szeretnéd lekérni a plusz menüket, oldalakat. A getPage kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
Az oldal egyedi azonosítója.
Lang   string
Meghatározhatod, hogy milyen nyelvű oldalakat szeretnél letölteni. A nyelvet az ISO 639-1 szabvány szerinti két karakteres kóddal kell meghatározni (pl.: hu, en, de).
ContentId   integer
Az ebben a mezőben szereplő tartalmi elemhez tartozó oldalakat, menüpontokat kérdezheted le. Ehhez a tartalmi elem egyedi azonosítóját kell használnod.
ParentId   integer
Ha a tartalmak hierarchikusan kerültek kiépítésre, a szülő elemre hivatkozva lekérheted az alá tartozó gyerek elemeket, ehhez a szülő elem egyedi azonosítóját használd.
LimitNum   integer
Amennyiben csak bizonyos számú oldalt szeretnél lekérni, itt adhatod meg a limit értéket.
LimitStart   integer
Meghatározhatod, hogy hányadik oldaltól induljon az oldalak, menük lekérése. Darabszámot, azaz pozitív egész számot várunk ebbe a mezőbe és csak a LimitNum paraméterrel együtt használható.
getPage válasz
A getPage kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setPage kérés
A setPage kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
etPage válasz
A setPage válaszban láthatod az információkat a módosított, létrehozott illetve törölt oldalakról, menükről. Alább láthatod a válaszban található mezők bővebb bemutatását.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbi lehet:
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A plusz oldalak kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getPage kérésre a választ, illetve ilyen formában kell beküldened a setPage kérést. Az egyes mezőkhöz külön található leírás, feltüntetjük, hogy melyik adattag használható a getPage illetve setPage végpontokhoz - GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setPage funkció művelete.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
Az oldal egyedi azonosítója, setPage végpont esetében csak azonosításra szolgál.
Lang   string GET SET
Az oldalhoz tartozó vásárló felületi nyelvet tudod szabályozni, beállítani vele.
Name   string GET SET
Az oldal megnevezése.
Title   string GET SET
Az oldal címe.
Parent   integer GET SET
HA az adott oldal egy másik tartalmi elem alá tartozik, annak az azonosítója.
Order   integer GET SET
Az oldal menübeli sorrendjének értéke.
Reg   enum GET SET
Azt tudod szabályozni, hogy az oldal láthatósága belépéshez kötött e vagy sem.
Használható értékek
yes no
Menu   enum GET SET
Az oldal menübeli megjelenését lehet megadni.
Használható értékek
yes no
Target   enum GET SET
Azt tudod szabályozni, hogy az oldal milyen módon nyíljon meg a látogató számára a böngészőben.
Használható értékek
blank Új böngésző oldalon
self Az aktív böngésző oldalon
Main   enum GET SET
Megadható, hogy az adott oldal legyen a vásárló felület főoldala.
Használható értékek
yes no
ShowMainPage   enum GET SET
Megadható, hogy az oldal megjelenik e a főoldalon vagy sem. Csak bizonyos kinézetek esetében használható funkció.
Használható értékek
yes no


Az alábbi kinézetekben használható
Orion
Castor
Polaris
Antares
Pollux
Sirius
Type   enum GET SET
Az oldal típusa.
Használható értékek
normal Normál belső oldal
landing Landoló oldal
link Link típusú oldal
Link   object GET SET
A link típusú oldalnál a linkre vonatkozó adatok.
Link.Type   enum GET SET
A link típusa.
Használható értékek
http
https
ftp
mms
mailto
phone
anchor
Link.Url   string GET SET
A link URL-je.
SefUrl   string GET SET
Keresőbarát URL, az áruház domain neve nélkül.
Meta   object GET SET
Tartalmi elemhez tartozó meta adatok.
Meta.Keywords   string GET SET
Az oldal kulcsszavainak (keywords) tartalma.
Meta.Description   string GET SET
Az oldal leírásának (description) tartalma.
Meta.Title   string GET SET
Az oldal címének (title) tartalma.
AutomaticMeta   object GET SET
Ha manuálisan nem állítasz be META tartalmakat, a rendszer az alapbeállítások szerint automatikusan generál adatot, ezeket tudod itt kezelni.
AutomaticMeta.Keywords   string GET SET
Automatikusan generált kulcsszó (keywords) tartalma.
AutomaticMeta.Description   string GET SET
Automatikusan generált leírás (description) tartalma.
AutomaticMeta.Title   string GET SET
Automatikusan generált cím (title) tartalma.
Groups   object GET SET
Megadhatod, hogy egy-egy tartalmat csak bizonyos vásárló csoport tagjai láthassanak.
Groups.Group   object GET SET
Adott vásárló csoporthoz tartozó adatok.
Groups.Group.Id   string GET SET
A vásárló csoport egyedi azonosítója.
Image   object GET SET
Az oldalhoz tartozó kép adatok.
Image.OG   string GET SET
Az oldalhoz tartozó OG image URL.
Contents   object GET SET
További tartalmi elemet rendelhetsz az oldaladhoz, így annak részeként jelenik meg az áruházban a látogatók számára.
Contents.Content   object GET SET
Az oldalon megjelenő tartalmi elem adatait összefoglaló elem.
Contents.Content.Id   integer GET SET
Az oldalon megjelenő tartalmi elem egyedi azonosítója.
Példák
Plusz menük lekérése
Ebben a példában a getPage kérést mutatjuk be. Az alábbi minta XML-lel a magyar nyelven megjelenő oldalakat kérheted le, az ötödik elemtől kezdve maximum 10 oldalt lekérve.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>    
    <Lang>hu</Lang>        
    <LimitStart>5</LimitStart>
    <LimitNum>10</LimitNum>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Pages>
	<Page>
		<Id>476309</Id>
		<Lang>hu</Lang>
		<Name><![CDATA[Űrlap]]></Name>
		<Title><![CDATA[Űrlap címe]]></Title>
		<Parent>0</Parent>
		<Order>1</Order>
		<Reg>no</Reg>
		<Menu>yes</Menu>
		<Target>self</Target>
		<Main>no</Main>
		<ShowMainPage>no</ShowMainPage>
		<Type>normal</Type>
		<AutomaticMeta>
			<Keywords><![CDATA[Űrlap, [page], Unas]]></Keywords>
			<Description><![CDATA[Űrlap, [page], Unas]]></Description>
			<Title><![CDATA[Űrlap - [page] - Unas]]></Title>
		</AutomaticMeta>
		<Contents>
			<Content>
				<Id>143154</Id>
			</Content>
		</Contents>
	</Page>
	<Page>
		<Id>824161</Id>
		<Lang>hu</Lang>
		<Name><![CDATA[Blog]]></Name>
		<Title><![CDATA[Blog címe]]></Title>
		<Parent>0</Parent>
		<Order>2</Order>
		<Reg>no</Reg>
		<Menu>yes</Menu>
		<Target>self</Target>
		<Main>no</Main>
		<ShowMainPage>no</ShowMainPage>
		<Type>normal</Type>
		<AutomaticMeta>
			<Keywords><![CDATA[Blog, [page], Unas]]></Keywords>
			<Description><![CDATA[Blog, [page], Unas]]></Description>
			<Title><![CDATA[Blog - [page] - Unas]]></Title>
		</AutomaticMeta>
		<Contents>
			<Content>
				<Id>142858</Id>
			</Content>
		</Contents>
	</Page>
	<Page>
		<Id>984031</Id>
		<Lang>hu</Lang>
		<Name><![CDATA[Ajánló]]></Name>
		<Title><![CDATA[Ajánló címe]]></Title>
		<Parent>0</Parent>
		<Order>3</Order>
		<Reg>no</Reg>
		<Menu>yes</Menu>
		<Target>self</Target>
		<Main>no</Main>
		<ShowMainPage>no</ShowMainPage>
		<Type>normal</Type>
		<SefUrl><![CDATA[ajanlo]]></SefUrl>
		<AutomaticMeta>
			<Keywords><![CDATA[ajánló, [page], Unas]]></Keywords>
			<Description><![CDATA[ajánló, [page], Unas]]></Description>
			<Title><![CDATA[ajánló - [page] - Unas]]></Title>
		</AutomaticMeta>
		<Contents>
			<Content>
				<Id>142865</Id>
			</Content>
		</Contents>
	</Page>
</Pages>


Plusz menük szerkesztése
A második példában a setPage funkció mutatjuk be, a példa XML-ben egy új oldal hozzáadását láthatod.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Pages>
	<Page>
		<Action>add</Action>		
		<Lang>hu</Lang>
		<Name><![CDATA[Blog]]></Name>
		<Title><![CDATA[Blog]]></Title>
		<Parent>0</Parent>
		<Order>1</Order>
		<Reg>no</Reg>
		<Menu>yes</Menu>
		<Target>blank</Target>
		<Main>no</Main>
		<ShowMainPage>no</ShowMainPage>
		<Type>normal</Type>
		<Link>
			<Type>https</Type>
			<Url><![CDATA[unas.hu/blog]]></Url>
		</Link>
		<SefUrl><![CDATA[blog]]></SefUrl>
		<Meta>
			<Keywords><![CDATA[a weboldalam blogja]]></Keywords>
			<Description><![CDATA[a weboldalam blogja]]></Description>
			<Title><![CDATA[blog]]></Title>
		</Meta>		
		<Groups>
			<Group>
				<Id>0</Id>
			</Group>
			<Group>
				<Id>356</Id>
			</Group>
		</Groups>
		<Image>
			<OG><![CDATA[http://unas.hu/og_image.JPG]]></OG>
		</Image>
		<Contents>
			<Content>
				<Id>142860</Id>
			</Content>
			<Content>
				<Id>142865</Id>
			</Content>
		</Contents>
	</Page>
</Pages>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Pages>
	<Page>
		<Action>add</Action>
		<Id>580692</Id>
		<Status>ok</Status>
	</Page>
</Pages>
Tartalmi elemek
A tartalmi elemek kezeléséhez használatos a funkció, a végpontok segítségével le tudod kérdezni a már létrehozott tartalmakat, míg a set használatával módosítani, törölni vagy épp létrehozni tudsz plusz tartalmi elemet.
getPageContent
A getPageContent végponttal listázhatók az áruházban létrehozott plusz oldalak, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getPageContent
A getPageContent kérésben láthatod, hogy milyen módon lehet a plusz menüket listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setPageContent
A setPageContent végpont használatával tudsz létrehozni, módosítani illetve törölni tartalmi elemeket.
Végpont: https://api.unas.eu/shop/setPageContent
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setPageContent kérést, melynek válaszát a setPageContent válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getPageContent kérés
A getPageContent kérésben határozhatod meg, milyen feltételek alapján szeretnéd lekérni a tartalmi elemeket. A getPageContent kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
A tartalmi elem egyedi azonosítója.
Type   enum
A tartalmi elem típusa, csak az itt megjelölt típusú tartalmi elemek szerepelnek majd GET válaszban.
Használható értékek
product_offer Termék ajánló
form Űrlap
image_gallery Képgaléria
blog Blog
normal Normál
Lang   string
Meghatározhatod, hogy milyen nyelvű tartalmi elemeket szeretnél letölteni. A nyelvet az ISO 639-1 szabvány szerinti két karakteres kóddal kell meghatározni (pl.: hu, en, de).
PageId   integer
Plusz oldal egyedi azonosítója. Csak azok a tartalmi elemek jelennek meg, amelyeket ehhez a plusz oldalhoz rendeltél az áruházadban.
LimitNum   integer
Ha nem az összes tartalmi elemet szeretnéd letölteni, akkor itt határozhatod meg, hogy hány elem jelenjen meg maximum.
LimitStart   integer
Ha nem az összes tartalmi elemet szeretnéd letölteni, akkor itt határozhatod meg, hogy hányadik elemtől induljon a tartalmi elemek lekérdezése. A mezőben pozitív egész számot várunk és csak a LimitNum paraméterrel együtt használható.
getPageContent válasz
A getPageContent kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setPageContent kérés
A setPageContent kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setPageContent válasz
A setPageContent válaszban láthatod az információkat a módosított, létrehozott illetve törölt tartalmi elemekről. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbi lehet.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
A tartalmi elem egyedi azonosítója.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A tartalmi elemek kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getPageContent kérésre a választ, illetve ilyen formában kell beküldened a setPageContent kérést. Az egyes mezőkhöz külön található leírás is. Feltűntetjük azt, hogy melyik adattag használható a getPageContent illetve setPageContent végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
setPageContent végpont használatakor ebben a mezőben határozhatod meg az API hívás műveletét.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A tartalmi elem egyedi azonosítója. A setPageContent végpont használatakor csak azonosítás céljából használható.
Lang   string GET SET
A tartalmi elem nyelve, ISO 639-1 szabvány szerinti két karakteres kóddal kell meghatározni (pl.: hu, en, de).
Title   string GET SET
A tartalmi elem címe.
Type   enum GET SET
A tartalmi elem típusa.
Használható értékek
normal Normál, szöveges tartalmi elem
blog Blog
image_gallery Képgaléria
form Űrlap
product_offer Termék ajánló
Author   object GET SET
Blog típusú tartalmi elem esetén használható ez a mező. A blog szerzőjének az adatait tartalmazza.
Author.Name   string GET SET
A blog szerzőjénk a neve.
Author.Image   string GET SET
Kép a blog szerzőjéről.
Published   enum GET SET
A tartalmi elem publikus-e vagy sem.
Használható értékek
yes no
Explicit   enum GET SET
A tartalom 18 éven felülieknek szól.
Használható értékek
yes no
CommentAllowed   enum GET SET
Komment lehetőség. Csak blog típusnál használható.
Használható értékek
yes no
RSS   enum GET SET
RSS feed-ben szerepeljen-e vagy sem.
Használható értékek
yes no
SefUrl   string GET SET
A tartalmi elem keresőbarát URL-je az áruház domain neve nélkül. Csak blog típus esetén használható.
Image   object GET SET
A tartalmi elemhez meghatározható kép adatok. Csak blog típus esetén használható.
Image.Lead   string GET SET
A blog típusú tartalmi elem bevezető képe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.LeadRetina   string GET SET
A blog típusú tartalmi elem bevezető kép retina (nagy felbontású) verziója. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsBase   string GET SET
A blog típusú tartalmi elem részletek oldali alapértelmezett képe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsBaseRetina   string GET SET
A blog típusú tartalmi elem részletek oldali alapértelmezett retina (nagy felbontású) képe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsLg   string GET SET
A blog típusú tartalmi elem részletek oldali nagyméretű (large) képe, melynek a reszponzív oldalkialakításnál van szerepe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsLgRetina   string GET SET
A blog típusú tartalmi elem részletek oldali nagyméretű (large) kép retina verziója, melynek a reszponzív oldalkialakításnál van szerepe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsMd   string GET SET
A blog típusú tartalmi elem részletek oldali közepes (medium) képe, melynek a reszponzív oldalkialakításnál van szerepe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsMdRetina   string GET SET
A blog típusú tartalmi elem részletek oldali közepes (medium) kép retina verziója, melynek a reszponzív oldalkialakításnál van szerepe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsSm   string GET SET
A blog típusú tartalmi elem részletek oldali kicsi (small) képe, melynek a reszponzív oldalkialakításnál van szerepe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.DetailsSmRetina   string GET SET
A blog típusú tartalmi elem részletek oldali kicsi (small) kép retina verziója, melynek a reszponzív oldalkialakításnál van szerepe. Képfeltöltés itt nem lehetséges, a webáruház fájlkezelőjében szerepelnie kell a képnek.
Image.OG   string GET SET
A blog típusú tartalmi elem OG Image URL-je.
Meta.Keywords   string GET SET
A tartalmi elem keywords meta tag tartalma.
Meta.Description   string GET SET
A tartalmi elem description meta tag tartalma.
Meta.Title   string GET SET
A tartalmi elem title tag tartalma.
AutomaticMeta   object GET SET
Automatikusan generált meta adatok, ha nincs manuálisan beállított adat.
AutomaticMeta.Keywords   string GET SET
A tartalmi elem keywords meta tag tartalma.
AutomaticMeta.Description   string GET SET
A tartalmi elem description meta tag tartalma.
AutomaticMeta.Title   string GET SET
A tartalmi elem title tag tartalma.
Dates   object GET SET
A tartalmi elemhez kapcsolódó időpontok.
Dates.Publication   string GET SET
Publikálás időpontja.
Dates.Expiration   string GET SET
Lejárat időpontja.
Pages   object GET
Megmutatja, melyik menüpontban jelenik meg a tartalmi elem.
Pages.Page   object GET
Egy menüpont adatai.
Pages.Page.Id   integer GET
A menüpont egyedi azonosítója.
NormalContent   object GET SET
Egy normál tartalmi elem adatait tartalmazó mező.
NormalContent.Text   string GET SET
A normál tartalmi elemek szöveges tartalma.
NormalContent.ContentIsHTML   string GET SET
A normál tartalmi elemek szöveges tartalma HTML tartalomként jelenik-e meg vagy sem.
Használható értékek
yes no
BlogContent   object GET SET
Egy blog típusú tartalmi elemet leíró mező.
BlogContent.Lead   string GET SET
A blog típusú tartalmi elemek bevezető szövege.
BlogContent.LeadIsHTML   string GET SET
A blog típusú tartalmi elemek bevezető szövege HTML tartalomként jelenik-e meg vagy sem.
Használható értékek
yes no
BlogContent.Text   string GET SET
A blog típusú tartalmi elemek tartalma.
BlogContent.ContentIsHTML   string GET SET
A blog típusú tartalmi elemek szöveges tartalma HTML tartalomként jelenik-e meg vagy sem.
Használható értékek
yes no
ConnectedContents   object GET SET
A blog típusú tartalmi elemhez csatolt tartalmi elemek.
ConnectedContents.ConnectedContent   object GET SET
A blog típusú tartalmi elemhez csatolt tartalmi elem.
ConnectedContents.ConnectedContent.Id   integer GET SET
A blog típusú tartalmi elemhez csatolt tartalmi elem egyedi azonosítója.
ConnectedContents.ConnectedContent.Title   string GET
A blog típusú tartalmi elemhez csatolt tartalmi elem címe.
ImageGalleryContent   object GET SET
A képgaléria típusú tartalmi elemek tulajdonságait tartalmaző mező.
ImageGalleryContent.GaleryType   enum GET SET
A képgaléria típusa.
Használható értékek
linear Képek sorfolytonosan
table Képek táblázatba rendezve
ImageGalleryContent.Images   object GET SET
A képgaléria képei.
ImageGalleryContent.Images.Image   object GET SET
A képgaléria egy képe.
ImageGalleryContent.Images.Image.Url   string GET SET
A kép elérési URL-je.
ImageGalleryContent.Images.Image.AltName   string GET SET
A kép neve. Ez a szöveg jelenik meg az img HTML tag alt attribútumában.
FormContent   object GET SET
Az űrlap típusú tartalmi elemet leíró mező.
FormContent.FormEmail   string GET SET
Ebben a mezőben meghatározott email címre küldi ki a rendszer az űrlap tartalmát.
FormContent.FormCaptchaUse   enum GET SET
reCAPTCHA használata az űrlaphoz.
Használható értékek
yes no
FormContent.FormItems   object GET SET
Az űrlapon megjelenő űrlap elemek.
Használható értékek
yes no
FormContent.FormItems.FormItem   object GET SET
Egy űrlap elemet leíró mező.
FormContent.FormItems.FormItem.Type   enum GET SET
Egy űrlap elem típusát határozhatod meg ebben a mezőben, csak tartalmi elem létrehozásakor használható.
Használható értékek
text Egysoros szövegbeviteli mező
email Email cím
textarea Többsoros szövegbeviteli mező
radio Radio gomb: az űrlapon belül eldöntendő kérdéseket kezel
checkbox Checkbox gomb egy űrlapon belül akár több lehetőség kiválasztására szolgál
select Legördülő menü egy legördülő menü kínál választási lehetőséget
file Melléklet csatolására alkalmas mező
FormContent.FormItems.FormItem.Required   enum GET SET
Beállítható illetve lekérdezhető, hogy az űrlap elem kitöltése kötelező-e vagy sem. Csak tartalmi elem lététrehozásakor használható.
Használható értékek
yes no
FormContent.FormItems.FormItem.Label   string GET SET
Az űrlap elem megnevezése.
FormContent.FormItems.FormItem.Options   string GET SET
Választható lehetőségeket határozhatod meg ebben a mezőben.
Az alábbi űrlap elem típusok esetében használható a mező.
radio Radio gomb: az űrlapon belül eldöntendő kérdéseket kezel
checkbox Checkbox gomb: egy űrlapon belül akár több lehetőség kiválasztására szolgál
select Legördülő menü: egy legördülő menü kínál választási lehetőséget
FormContent.FormItems.FormItem.Options.Option   string GET SET
Egy választási lehetőséget határozhatsz meg ebben a mezőben.
ProductOfferContent   object GET SET
A termék ajánló típusú tartalmi elem tartalma.
ProductOfferContent.Layout   integer GET SET
A termék ajánló oldal típusa.
ProductOfferContent.VisibleTitle   string GET SET
A termék ajánlónál megjelenő cím szövege.
ProductOfferContent.ButtonCaption   string GET SET
A termék ajánlónál megjelenő gomb felirata.
ProductOfferContent.ButtonUrl   string GET SET
A termék ajánlónál megjelenő gombhoz tartozó URL.
ProductOfferContent.MaxDisplayedProduct   integer GET SET
A termék ajánlónál megjelenő termékek maximális száma.
ProductOfferContent.StockSetting   integer GET SET
A raktárkészlet beállítások értéke.
Használható értékek
0 Raktárhiányos termékek megjelenítése
1 Raktárhiányos, nem vásárolható termékek elrejtése
2 Raktárhiányos termékek elrejtése>
ProductOfferContent.Order   enum GET SET
A termék ajánlóban megjelenő termékek sorrendjét határozhatod meg ebben a mezőben.
Használható értékek
fix Rögzített sorrendben jelennek meg a termékek
random Véletlenszerű sorrendben jelennek meg a termékek
by_product_list A terméklista sorrendje alapján jelennek meg a termékek
ProductOfferContent.Products   object GET SET
A termék ajánlóban megjelenő termékek adatai.
ProductOfferContent.Products.Product   object GET SET
A termék ajánlóban megjelenő termék adatai.
ProductOfferContent.Products.Product.Sku   string GET SET
A termék ajánlóban megjelenő termék cikkszáma.
ProductOfferContent.Categories   object GET SET
A termék ajánlóban megjelenő kategóriák adatai.
ProductOfferContent.Categories.Category   object GET SET
A termék ajánlóban megjelenő kategória adatai.
ProductOfferContent.Categories.Category.Id   integer GET SET
A termék ajánlóban megjelenő kategória azonosítója.
Példák
Tartalmi elemek lekérése
Ebben a példában a getPageContent kérést mutatjuk be. Az XML-lel a magyar nyelven megjelenő tartalmi elemeket kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>    
    <Lang>hu</Lang>        
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Id>142855</Id>
		<Title><![CDATA[Normál tartalom]]></Title>
		<Type>normal</Type>
		<Lang>hu</Lang>
		<Published>yes</Published>
		<Explicit>no</Explicit>
		<Dates>
			<Publication>2022.03.15 14:42</Publication>
			<Expiration>2022.04.15 15:00</Expiration>
		</Dates>
		<NormalContent>
			<Text><![CDATA[Lorem ipsum dolor sit amet, consectetur adipiscing elit...]]></Text>
		</NormalContent>
	</PageContent>
	<PageContent>
		<Id>142858</Id>
		<Title><![CDATA[Blog]]></Title>
		<Type>blog</Type>
		<Lang>hu</Lang>
		<Author>
			<Name><![CDATA[Gipsz Jakab]]></Name>
			<Image><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/author_pic/jakab.jpg]]></Image>
		</Author>
		<Published>yes</Published>
		<Explicit>yes</Explicit>
		<RSS>yes</RSS>
		<CommentAllowed>yes</CommentAllowed>
		<SefUrl><![CDATA[blog]]></SefUrl>
		<ConnectedContents>
			<ConnectedContent>
				<Id><![CDATA[142855]]></Id>
				<Title><![CDATA[normál]]></Title>
			</ConnectedContent>
			<ConnectedContent>
				<Id><![CDATA[142860]]></Id>
				<Title><![CDATA[galéria]]></Title>
			</ConnectedContent>
		</ConnectedContents>
		<Image>
			<Lead><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/lead.jpg]]></Lead>
		</Image>
		<Meta>
			<Keywords><![CDATA[blog keywords]]></Keywords>
			<Description><![CDATA[blog desc]]></Description>
			<Title><![CDATA[blog title]]></Title>
		</Meta>
		<Dates>
			<Publication>2022.03.15 17:00</Publication>
		</Dates>
		<BlogContent>
			<Lead><![CDATA[Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.]]></Lead>
			<Text><![CDATA[Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.]]></Text>
		</BlogContent>
		<Pages>
			<Page>
				<Id>824161</Id>
			</Page>
		</Pages>
	</PageContent>
</PageContents>


Normál tartalmi elem létrehozása
A második példa alapján a setPageContent funkció segítségével hozhatsz létre egy normál típusú tartalmi elemet, megadva hogy melyik oldalakon jelenjen meg.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
	    <Action>add</Action>
		<Title><![CDATA[Tartalmi elem 1]]></Title>
		<Type>normal</Type>
		<NormalContent>
		    <Text><![CDATA[normál tartalom szövege]]></Text>
		</NormalContent>
		<Pages>
			<Page>
				<Id>460801</Id>
			</Page>
			<Page>
				<Id>460802</Id>
			</Page>
		</Pages>
		<Published>yes</Published>
		<Explicit>no</Explicit>		
		<Dates>
			<Publication>2022.02.01 12:00</Publication>
			<Expiration>2022.03.15 12:00</Expiration>
		</Dates>			
	</PageContent>	
</PageContents>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Action>add</Action>
		<Id>309122</Id>
		<Status>ok</Status>
	</PageContent>
</PageContents>


Blog tartalmi elem létrehozása
A harmadik példában látható XML alapján egy blog típusú tartalmi elemet hozhatsz létre a webshopodban.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
	    <Action>add</Action>
		<Title><![CDATA[Első blogom]]></Title>
		<Type>blog</Type>
		<Author>
		    <Name><![CDATA[Teszt Elek]]></Name>
		    <Image><![CDATA[https://unas.hu/author.jpg]]></Image>
		</Author>
		<BlogContent>
		    <Lead><![CDATA[az első blogbejegyzésem bevezető szövege]]></Lead>
		    <Text><![CDATA[az első blogbejegyzésem tartalma]]></Text>
		</BlogContent>
		<Published>yes</Published>
		<Explicit>no</Explicit>
		<CommentAllowed>yes</CommentAllowed>
		<ConnectedContents>
			<ConnectedContent>
				<Id>100100</Id>
			</ConnectedContent>
			<ConnectedContent>
				<Id>100200</Id>
			</ConnectedContent>
		</ConnectedContents>
		<SefUrl><![CDATA[elso-blog-bejegyzes]]></SefUrl>
		<Image>
		    <Lead><![CDATA[https://unas.hu/blog_lead.jpg]]></Lead>
		    <OG><![CDATA[https://unas.hu/og_image.jpg]]></OG>
		</Image>
		<Meta>
			<Keywords><![CDATA[keywords, key, words]]></Keywords>
			<Description><![CDATA[az első blog bejegyzésem]]></Description>
			<Title><![CDATA[Ez a címben is megjelenik]]></Title>
		</Meta>
		<Dates>
			<Publication>2022.02.01 12:00</Publication>
			<Expiration>2022.03.15 12:00</Expiration>
		</Dates>		
	</PageContent>	
</PageContents>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Action>add</Action>
		<Id>309123</Id>
		<Status>ok</Status>
	</PageContent>
</PageContents>


Galéria tartalmi elem létrehozása
A negyedik példában látható XML alapján egy galéria típusú tartalmi elemet hozhatsz létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Action>add</Action>
		<Title><![CDATA[Galéria 1]]></Title>
		<Type>image_gallery</Type>
		<Published>yes</Published>
		<Explicit>no</Explicit>		
		<Dates>
			<Publication>2022.02.14 12:35</Publication>
			<Expiration>2022.06.03 12:35</Expiration>
		</Dates>
		<ImageGalleryContent>
		    <GalleryType>table</GalleryType>
			<Images>
			    <Image>
				    <URL><![CDATA[/shop_id/pic/image.jpg]]></URL>
				    <AltName><![CDATA[Első kép ALT szövege]]></AltName>
			    </Image>
			    <Image>
				    <URL><![CDATA[/shop_id/pic/image2.jpg]]></URL>
				    <AltName><![CDATA[Második kép ALT szövege]]></AltName>
			    </Image>
			</Images>
		</ImageGalleryContent>		
		<Pages>
			<Page>
				<Id>460801</Id>
			</Page>			
		</Pages>
	</PageContent>	
</PageContents>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Action>add</Action>
		<Id>309124</Id>
		<Status>ok</Status>
	</PageContent>
</PageContents>


Űrlap tartalmi elem létrehozása
Az ötödik példában látható XML alapján egy űrlap típusú tartalmi elemet hozhatsz létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
	    <Action>add</Action>
		<Title><![CDATA[Jelentkezési űrlap]]></Title>
		<Type>form</Type>
		<Published>yes</Published>
		<Explicit>no</Explicit>
		<Dates>
			<Publication>2022.02.14 12:35</Publication>
			<Expiration>2022.06.03 12:35</Expiration>
		</Dates>
		<FormContent>
		    <FormEmail><![CDATA[unas@unas.hu]]></FormEmail>
			<FormCaptchaUse>yes</FormCaptchaUse>
			<FormItems>
    			<FormItem>
    				<Type>text</Type>
    				<Label><![CDATA[egysoros szövegbeviteli mező]]></Label> 
    				<Required>yes</Required>
			    </FormItem>
    			<FormItem>
    				<Type>email</Type>
    				<Label><![CDATA[email cím]]></Label>
    				<Required>yes</Required>
    			</FormItem>
    			<FormItem>
    				<Type>textarea</Type>
    				<Label><![CDATA[többsoros szövegbeviteli mező]]></Label>
    				<Required>no</Required>
    			</FormItem>
    			<FormItem>
    			    <Type>radio</Type>
    				<Label><![CDATA[rádió gomb megnevezése]]></Label>
    				<Required>no</Required>
    			    <Options>
    			        <Option><![CDATA[rádió gomb - opció1]]></Option>
    				    <Option><![CDATA[rádió gomb - opció2]]></Option>
    				    <Option><![CDATA[rádió gomb - opció3]]></Option>
    			    </Options>
    			</FormItem>
    			<FormItem>
    			    <Type>checkbox</Type>
    				<Label><![CDATA[checkbox gomb megnevezése]]></Label>
    				<Required>no</Required>
    				<Options>
    				    <Option><![CDATA[checkbox gomb - opció1]]></Option>
    				    <Option><![CDATA[checkbox gomb - opció2]]></Option>
    				</Options>
    			</FormItem>
    			<FormItem>
    			    <Type>select</Type>
    				<Label><![CDATA[legördülő menü megnevezése]]></Label>
    				<Required>no</Required>
    				<Options>
    				    <Option><![CDATA[legördülő menü - opció1]]></Option>
    				    <Option><![CDATA[legördülő menü - opció2]]></Option>
    				</Options>
    			</FormItem>
    			<FormItem>
    				<Type>file</Type>
    				<Label><![CDATA[melléklet csatolására alkalmas mező]]></Label>
    				<Required>no</Required>
    			</FormItem>
    		</FormItems>
    	</FormContent>
	</PageContent>	
</PageContents>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Action>add</Action>
		<Id>309125</Id>
		<Status>ok</Status>
	</PageContent>
</PageContents>


Termékajánló tartalmi elem létrehozása
A hatodik példában látható XML alapján egy termékajánló típusú tartalmi elemet hozhatsz létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
	    <Action>add</Action>
		<Title><![CDATA[Teszt]]></Title>
		<Type>product_offer</Type>
		<Published>yes</Published>
		<Explicit>no</Explicit>
		<Dates>
			<Publication>2022.02.01 10:25</Publication>
			<Expiration>2022.10.09 12:25</Expiration>
		</Dates>
    	<ProductOfferContent>
		    <Layout>3</Layout>
			<Order>fix</Order> 
			<Products>
			    <Product>
			        <Sku><![CDATA[ABC001]]></Sku>
			    </Product>
			    <Product>
			        <Sku><![CDATA[ABC002]]></Sku>
			    </Product>
			    <Product>
			        <Sku><![CDATA[ABC003]]></Sku>
			    </Product>
			</Products>
		</ProductOfferContent>
		<Pages>
			<Page>
				<Id>460801</Id>
			</Page>
			<Page>
				<Id>460802</Id>
			</Page>
		</Pages>
	</PageContent>	
</PageContents>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PageContents>
	<PageContent>
		<Action>add</Action>
		<Id>309126</Id>
		<Status>ok</Status>
	</PageContent>
</PageContents>
Fájlok, mappák
A fájlkezelő végpontok használatával lehetőséged van az áruházad Fájlkezelő menüpontjában elérhető tárhelyet kezelni, mappákat létrehozni, fájlokat feltölteni, törölni stb. Fontos, hogy ez a tárhely nem egyenlő a külön hosting szolgáltatásunkon keresztül igénybe vett tárhelyekkel!
getStorage
Az alábbi végpont visszaadja az áruház Fájlkezelőjében tárolt, a kérésben meghatározott feltételeknek megfelelő fájlok, mappák adatait.
Végpont: https://api.unas.eu/shop/getStorage
A GET kérésben láthatod, hogy milyen módon lehet a vásárlókat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setStorage
A setStorage funckió segítségével fájlkezelő műveleteket végezhetsz el. Létrehozhatsz, törölhetsz mappákat, illetve feltölthetsz, törölhetsz fájlokat.
Végpont: https://api.unas.eu/shop/setStorage
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setStorage kérést, melynek a válaszát a SET válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getStorage kérés
Type   enum
A lekérdezni kívánt adatok típusára lehet szűrni ezzel a mezővel.
Használható értékek
all Fájlok és mappák is szerepelnek a válaszban. Alapértelmezett érték.
file Csak fájlok szerepelnek a fájlban.
folder Csak könyvtárak szerepelnek a válaszban.
GetInfo   enum
A mező használatával, a webshop tárhelyének állapotáról kaphatunk információt.
Használható értékek
only Csak az információk szerepelnek a válaszban.
yes Szerepelnek az információk a válaszban.
no Nem szerepelnek az információk a válaszban. Alapértelmezett érték.
Folder   string
Amennyiben csak egy általad választott mappa tartalmát szeretnéd a válaszban megkapni, úgy a mappa elérési útját kell megadnod a GET kérésben.
getStorage válasz
A getStorage kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setStorage kérés
A setStorage kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setStorage válasz
A setStorage válaszban láthatod az információkat a módosított, létrehozott illetve törölt fájlokról, könyvtárakról.
Action
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbi lehet.
create_folder Könyvtár létrehozás
delete_folder Könyvtár törlés
upload_file Fájl feltöltés
delete_file Fájl törlés
Status   enum
API hívás státusza.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
StorageItem   object GET SET
Egy fájlkezelőben megtalálható elemet leíró mező, ami lehet fájl vagy mappa.
StorageItem.Action   enum SET
setStorageItem végpont esetén használható művelet.
Használható értékek
create_folder Könyvtár létrehozás
delete_folder Könyvtár törlés
upload_file Fájl feltöltés
delete_file Fájl törlés
StorageItem.Type   enum GET
Az elem típusa.
Használható értékek
info A fájlkezelő állapotát leíró típus
file Fájl
folder Könyvtár
StorageItem.Folder   string SET
Csak SET hívásban használható, mappa létrehozásakor az adott mappa neve.
StorageItem.ActualSpace   string GET
Csak info típus esetén értelmezett, az aktuális tárhely foglaltság mértéke.
StorageItem.SpaceLimit   string GET
Csak info típus esetén értelmezett, az aktuális tárhely felső határértéke.
StorageItem.Filetype   string GET
Csak file típus esetén értelmezett, az elem típusa.
StorageItem.ModifyDate   string GET
Csak file típus esetén értelmezett, az elem utolsó módosításának dátuma.
StorageItem.Name   string GET SET
Az elem neve.
StorageItem.Url   string GET SET
Csak file típus esetén értelmezett, az elem elérési útvonala.
StorageItem.Path   string GET SET
Csak folder típus esetén értelmezett, az elem elérési útvonala.
Példák
Fájlok lekérése
Az alábbi példával lekérdezheted az összes fájlt a Fájlkezelő gyökér könyvtárából.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Type>file</Type>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[termék1.JPG]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/termek1.JPG]]></Url>
		<ModifyDate>2022.03.20 15:53:33</ModifyDate>
		<FileType><![CDATA[JPG]]></FileType>
	</StorageItem>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[product.xml]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/product.xml]]></Url>
		<ModifyDate>2022.02.11 10:42:18</ModifyDate>
		<FileType><![CDATA[XML]]></FileType>
	</StorageItem>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[szerzo.jpg]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/szerzo.jpg]]></Url>
		<ModifyDate>2022.03.20 15:53:34</ModifyDate>
		<FileType><![CDATA[JPG]]></FileType>
	</StorageItem>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[kep_link.csv]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/kep_link.csv]]></Url>
		<ModifyDate>2022.02.09 09:09:49</ModifyDate>
		<FileType><![CDATA[CSV]]></FileType>
	</StorageItem>
</StorageItems>


Egy konkrét könyvtár tartalmának lekérése
Az alábbi példával az images/products könyvtár teljes tartalmát kérdezheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Folder>images/products</Folder>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[termék1.JPG]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/images/products/termek1.JPG]]></Url>
		<ModifyDate>2022.03.20 15:53:33</ModifyDate>
		<FileType><![CDATA[JPG]]></FileType>
	</StorageItem>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[termék2.jpg]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/images/products/termek2.jpg]]></Url>
		<ModifyDate>2022.03.20 15:53:34</ModifyDate>
		<FileType><![CDATA[JPG]]></FileType>
	</StorageItem>
	<StorageItem>
		<Type>file</Type>
		<Name><![CDATA[termék3.jpg]]></Name>
		<Url><![CDATA[https://shop.unas.hu/shop_ordered/12345/pic/images/products/termek3.jpg]]></Url>
		<ModifyDate>2022.02.09 09:09:49</ModifyDate>
		<FileType><![CDATA[JPG]]></FileType>
	</StorageItem>
</StorageItems>


Könyvtár létrehozása
Az alábbi példával a gyökér könyvtárba hozhatsz létre egy Partners nevű könyvtárat.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
    <StorageItem>
        <Action>create_folder</Action>
        <Folder>Partners</Folder>
    </StorageItem>
</StorageItems>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
	<StorageItem>
		<Action>create_folder</Action>
		<Status>ok</Status>
	</StorageItem>
</StorageItems>


Könyvtár törlése
Az alábbi példával a gyökér könyvtárból törölheted az Images nevű könyvtárat. Ezt akkor teheted meg, ha a könyvtár üres.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
    <StorageItem>
        <Action>delete_folder</Action>
        <Folder>Images</Folder>
    </StorageItem>
</StorageItems>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
	<StorageItem>
		<Action>delete_folder</Action>
		<Status>ok</Status>
	</StorageItem>
</StorageItems>


Fájl feltöltése
Az alábbi példával egy képfájlt tölthetsz fel az Images könyvtárba.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
    <StorageItem>
        <Action>upload_file</Action>
        <Folder>Images</Folder>
        <Url><![CDATA[https://unas.hu/picture.jpeg]]></Url>
        <Name><![CDATA[kep.jpg]]></Name>
    </StorageItem>
</StorageItems>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<StorageItems>
	<StorageItem>
		<Action>upload_file</Action>
		<Status>ok</Status>
	</StorageItem>
</StorageItems>
Automata folyamatok
Az automata folyamatok funkció sok olyan azonnali vagy időzített tevékenység elvégzésére nyújt lehetőséget, ami nagyban segítheti az adminisztrátorok mindennapi munkáját. A folyamat két fő részből áll: egy esemény hatására egy műveletet végez el a rendszer, meghatározott feltételek teljesülése esetén.
Fontos, hogy az adott funkció az áruházakban a VIP előfizetői csomaghoz van kötve, így API-n keresztül is csak akkor használható, ha az adott áruház rendelkezik ezen csomaggal.
getAutomatism
A getAutomatism végponttal listázhatók az áruházban megtalálható automata folyamatok, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getAutomatism
A getAutomatism kérésben láthatod, hogy milyen módon lehet az automata folyamatokat lekérdezni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
VIP 90 hívás / óra
setAutomatism
A setAutomatism végpont segítségével tudod az automata folyamataidat létrehozni, módosítani illetve törölni a webáruházadból.
Végpont: https://api.unas.eu/shop/setAutomatism
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setAutomatism kérést, melynek válaszát a setAutomatism válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
VIP 90 hívás / óra
getAutomatism kérés
getAutomatism kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd az automata folyamatokat listázni. A getAutomatism kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
Az egyedi azonosítója alapján kérdezhetsz le egy automatizmust.
Active   string
Aktív illetve inaktív automatizmusokra szűrhetsz.
Használható értékek
yes no
Schedule   enum
Időzített vagy azonnal lefutó folyamatokra szűrhetsz.
Használható értékek
instant Azonnali folyamat
delayed Időzített folyamat
Operation   enum
Csak a kérésben szereplő művelettel létrehozott automatizmusok fognak szerepelni a válaszban.
használható értékek
email E-mail küldés
webhook Webhook
change_customer_group Vásárló csoportba helyezés
Event   enum
Csak a kérésben szereplő eseménnyel létrehozott automatizmusok fognak szerepelni a válaszban. Az alábbi eseményekre tudsz szűrni.
order_send Megrendelés leadás vásárló felületen
order_send_thirdparty Megrendelés beérkezése külső rendszerből
abandoned_cart Kosárelhagyás
newsletter_subscribe Hírlevélre feliratkozás
newsletter_unsubscribe Hírlevélről leiratkozás
customer_registration Vásárló regisztráció
customer_modification Vásárló adatok módosítása
customer_modify_admin Vásárló módosítása adminisztrátor által
customer_delete Vásárló törlés
successful_payment Sikeres fizetés
getAutomatism válasz
A getAutomatism kérésre kapott válasz adatainak és azok struktúrális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setAutomatism kérés
A setAutomatism kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setAutomatism válasz
A setAutomatism válaszban láthatod az információkat a módosított, létrehozott illetve törölt automata folyamatokról. A válasz az alábbi mezőket tartalmazhatja.
Action   enum
Az API híváshoz tartozó műveletet írja le. Az alábbi műveletekről kapsz visszajelzést az API válaszban.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely vagy sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
Az automata folyamatokat az alább látható adatszerkezet segítségével tudod kezelni. Az itt látható módon kell kérést intézni a szerverhez, ahol az egyes mezőkhöz külön található leírás arról, hogy melyik adattag használható a getAutomatism illetve setAutomatism végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setAutomatism kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
Az automata folyamat egyedi azonosítója. SET végpontnál csak azonosító adatként használható, nem módosítható.
Name   string GET SET
Az automata folyamat neve. Két ugyanolyan nevű folyamatot nem lehet létrehozni. Maximális hossza 255 karakter.
Active   enum GET SET
Megmutatja, hogy az automatizmus aktív vagy inaktív-e.
Használható értékek
yes no
Schedule   object GET SET
Beállíthatod az automatizmushoz, hogy az eseményhez meghatározott műveletet időzítve vagy azonnal hajtsa végre a rendszer.
Schedule.Type   enum GET SET
Az automatizmus időzítésének típusa. Meghatározhatod, hogy az esemény bekövetkezésekor azonnal vagy egy későbbi időpontban, időzítve menjen végbe a művelet. Azonnali végrehajtás esetén az esemény bekövetkezésétől számított maximum öt percen belül hajtja végre a szerver a műveletet.
Használható értékek
instant Azonnali
delayed Időzített, ebben az esetben kötelező meghatározni az időzítés mértékegységét és értékét
Schedule.Unit   enum GET SET
Az időzítés mértékegysége.
Használható értékek
minute hour day
Schedule.Value   integer GET SET
Az időzítés értéke. Perc alapú időzítés esetében a minimum beállítható érték 20 perc.
Event   object GET SET
Az automatizmushoz beállított esemény. A getAutomatism válaszban látható az esemény típusa illetve az eseményhez meghatározott szabályok is.
Event.Type   enum GET SET
Az esemény típusa.
Használható értékek
order_send Megrendelés leadás vásárló felületen
order_status_modify Megrendelés státuszváltás
order_modify_admin Megrendelés módosítása adminisztrátor által
order_add_admin Megrendelés létrehozása adminisztrátor által
order_send_thirdparty Megrendelés beérkezése külső rendszerből
order_delete Megrendelés törlése
abandoned_cart Elhagyott kosár
newsletter_subscribe Hírlevél feliratkozás
newsletter_subscribe_auth Hírlevél feliratkozás megerősítése
newsletter_unsubscribe Hírlevél leiratkozás
customer_registration Vásárló regisztráció
customer_modification Vásárló adatmódosítás
customer_modify_admin Vásárló módosítás admin által
customer_delete Vásárló törlés
successful_payment Sikeres fizetés
opinion_send Vélemény írás
Event.Rules   object GET SET
Az eseményhez tartozó szabályok. Az automatizmushoz több szabályt is definiálhatunk. A szabályok között ÉS logikai kapcsolat van, egy szabályon belül a vizsgált értékek között VAGY logikai kapcsolat van. Ha a getAutomatism válaszban nem szerepel egy szabály sem, akkor az automatizmushoz definiált műveletet mindenképpen elvégzi a rendszer.
Event.Rules.Rule   object GET SET
Egy szabályt leíró mező, melyben meghatározhatsz a szabályban vizsgált entitást, a vizsgálat során felhasznált relációt, a vizsgált értékek és entitás között. Minden eseménynél más-más entitáshoz tudsz szabályokat definiálni, erről bővebb információt az entitás fejezetben olvashatsz.
Event.Rules.Rule.Relation   enum GET SET
Az esemény szabályokhoz meghatározható reláció a vizsgálandó entitás és a vizsgált értékek között. Entitásonként változó, hogy milyen relációt definiálhatsz.
Használható relációk


Döntés
Reláció csoport decision
yes Igen
no Nem


Egyenlőség
Reláció csoport equality
equal Egyenlő
not_equal Nem egyenlő


Szöveg
Reláció csoport string
equal Egyenlő
not_equal Nem egyenlő
starts_with Ezzel kezdődik
ends_with Erre végződik
contains Tartalmazza


Szám
Reláció csoport number
equal Egyenlő
not_equal Nem egyenlő
less_than Kisebb, mint
greater_than Nagyobb, mint
less_than_or_equal Kisebb vagy egyenlő, mint
greather_than_or_equal Nagyobb vagy egyenlő, mint
Az entitás bekezdésben minden entitáshoz egy reláció csoportot jelöltünk meg, amit az esemény paraméterek mellett tűntetünk fel.
Event.Rules.Rule.Entity   enum GET SET
A vizsgált entitás, vagyis esemény paraméter, amire a szabályt létrehozod. Például megrendelés leadáskor az egyik ilyen vizsgált esemény paraméter a megrendelés végösszege lehet vagy a vásárló számlázási országa. A továbbiakban összefoglaljuk, melyik eseménynél milyen esemény paraméterekhez lehet szabályokat megfogalmazni.
Megrendelés leadás
order_send eseményhez az alábbi esemény paraméterek használhatók.
total_ordered_amount number Vásárló összköltése
total number Megrendelés végösszege
number_of_orders number Vásárló megrendeléseinek száma
currency equality Pénznem
email string Email cím
ordered_products_sku string Megrendelt termék cikkszáma
shipping_method string Szállítási mód neve
payment_method string Fizetési mód neve
customer_group equality Vásárló csoport
customer_shipping_name string Szállítási név
customer_shipping_zip string Szállítási irányítószám
customer_shipping_county string Szállítási megye
customer_shipping_country equality Szállítási ország
customer_shipping_city string Szállítási város
customer_billing_name string Számlázási név
customer_billing_zip string Számlázási irányítószám
customer_billing_county string Számlázási megye
customer_billing_country equality Számlázási ország
customer_billing_city string Számlázási város
newsletter_auth decision Hírlevél feliratkozás megerősítve
Megrendelés beérkezése külső rendszerből
order_send_thirdparty eseményhez a Megrendelés leadás esemény paraméterei használhatók illetve egy plusz esemény paraméter is, amely a source_of_order vagyis a Megrendelés forrása. Jelenleg három szűrési lehetőség van erre.
arukereso_hu Árukereső.hu kosárprogramban leadott megrendelések
emag_api eMAG Marketplace megrendelések
unas_api Unas API-val kezelt megrendelések
Kosárelhagyás
abandoned_cart eseményhez az alábbi esemény paraméterek használhatók.
customer_shipping_name string Szállítási név
customer_shipping_zip string Szállítási irányítószám
customer_shipping_county string Szállítási megye
customer_shipping_country equality Szállítási ország
customer_shipping_city string Szállítási város
customer_billing_name string Számlázási név
customer_billing_zip string Számlázási irányítószám
customer_billing_county string Számlázási megye
customer_billing_country equality Számlázási ország
customer_billing_city string Számlázási város
newsletter_up decision Hírlevélre feliratkozott
item_num number Kosárban lévő termékek száma
total_price number Kosárban lévő termékek összértéke
number_of_orders number Vásárló megrendeléseinek száma
products_sku string Kosárban lévő termék cikkszáma
products_name string Kosárban lévő termék neve
products_price number Kosárban lévő termék ára
currency string Pénznem
customer_group string Vásárló csoport
customer_email string Email cím
newsletter_auth decision Hírlevél feliratkozás megerősítve
Hírlevélre feliratkozás
newsletter_subscribe eseményhez az alábbi esemény paraméterek használhatók.
email string Feliratkozó email címe
name string Feliratkozó neve
customer_language string Feliratkozó által használt nyelv
Hírlevélről leiratkozás
newsletter_unsubscribe eseményhez az alábbi esemény paraméterek használhatók.
email string Feliratkozó email címe
customer_language string Feliratkozó által használt nyelv
Vásárló regisztráció / módosítás
customer_registration és customer_modification eseményhez az alábbi esemény paraméterek használhatók.
contact_name string Kapcsolattartó név
contact_phone string Kapcsolattartó telefonszáma
contact_mobile string Kapcsolattartó mobiltelefonszáma
email string Email cím
customer_shipping_name string Szállítási név
customer_shipping_zip string Szállítási irányítószám
customer_shipping_county string Szállítási megye
customer_shipping_country equality Szállítási ország
customer_shipping_city string Szállítási város
customer_billing_name string Számlázási név
customer_billing_zip string Számlázási irányítószám
customer_billing_county string Számlázási megye
customer_billing_country equality Számlázási ország
customer_billing_city string Számlázási város
newsletter_auth decision Hírlevél feliratkozás megerősítve
newsletter_up decision Hírlevélre feliratkozott
Vásárló módosítása adminisztrátor által és Vásárló törlés
customer_modify_admin és customer_delete eseményekhez az alábbi esemény paraméter használható fel.
email string Email cím
Sikeres fizetés
successful_payment eseményhez a Megrendelés leadás eseménynél leírt esemény paraméterek használhatók fel.
Event.Rules.Rule.Values   object GET SET
Az összehasonlítandó értékeket tartalmazó mező.
Event.Rules.Rule.Values.Value   string GET SET
Egy összehasonlítandó értéket tartalmazó mező. Bizonyos esetekben ez a mező nem csak nyers értékeket tartalmaz, hanem további XML mezőket. Például, ha az automatizmushoz beállított összehasonlítandó érték egy vásárló csoport, akkor a vásárló csoport azonosítója illetve neve szerepel ebben a mezőben. További mintakéréseket a példák fejezetben olvashatsz.
Operation   object GET SET
Az automatizmusokhoz meghatározhatunk műveleteket, melyeket egy esemény bekövetkezésének hatására végzünk el abban az esetben, ha az eseményhez meghatározott feltételek, szabályok teljesülnek.
Operation.Type   enum GET SET
Rendszerünkben jelenleg öt művelet típus választható.
email E-mail küldés
webhook Webhook
change_customer_group Vásárló csoportba helyezés
change_order_status Megrendelés státusz váltás. Csak successful_payment eseménynél használható
change_invoice_status Megrendelés számlázási státusz váltás. Csak successful_payment eseménynél használható
Operation.Config   object GET SET
A művelethez tartozó beállítások. Műveletenként változó a beállításokat tartalmazó Config mező felépítése.
Operation.Config.NewsletterTemplate   object GET SET
E-mail küldés művelet esetén használható. A hírlevél sablonok közül kell választani egyet.
Operation.Config.NewsletterTemplate.Id   integer GET SET
E-mail küldés művelet esetén használható. A hírlevél sablon egyedi azonosítója
Operation.Config.NewsletterTemplate.Name   string GET
E-mail küldés művelet esetén használható. A hírlevél sablon neve.
Operation.Config.Directuser   enum GET SET
E-mail küldés művelet esetén használható. Beállítható, hogy ki kapja meg a küldött emailt. yes opció esetén meghatározott email címekre lehet elküldeni az e-mailt, ellenkező esetben a vásárlónak, aki például a megrendelést leadta a vásárló felületen vagy módosította adatait a profiljában.
Értékkészlete
yes no
Operation.Config.DirectUserEmails   object GET SET
E-mail küldés művelet esetén használható. Az e-mail címeket tartalmazó mező.
Operation.Config.DirectUserEmail   string GET SET
E-mail küldés művelet esetén használható. Egy e-mail címet tartalmazó mező.
Operation.Config.WebhookUrl   string GET SET
A webhook művelethez be kell állítani az URL-t, amire a POST kérést küldi ki a rendszer az esemény bekövetkezését követően. A POST kérés tartalma egy JSON illetve a webhook-hoz tartozó HTTP fejlécek. A webhook-okat érdemes ellenőrizni a fogadó oldalon. Ehhez kapcsolódóan információkat a Webhook ellenőrzés fejezetben olvashatsz. A webhook hívás maximum 2 percig futhat.
Operation.Config.CustomerGroup   object GET SET
Vásárló csoportba helyezés művelet esetén használható. A vásárló csoportot leíró mező.
Operation.Config.CustomerGroup.Id   integer GET SET
Vásárló csoportba helyezés művelet esetén használható. A vásárló csoport egyedi azonosítója.
Operation.Config.CustomerGroup.Name   string GET
Vásárló csoportba helyezés művelet esetén használható. A vásárló csoport neve.
Operation.Config.OrderStatus   integer GET SET
Megrendelés státusz váltás művelet esetén használható. A megrendelés státusz egyedi azonosítója.
Operation.Config.InvoiceStatus   enum GET SET
Számlázási státusz váltás művelet esetében használható. A számlázási státusz értéke.
Értékkészlete
0 Nem számlázható
1 Számlázható
2 Számlázva
Webhook ellenőrzés
Webhook hívások esetén lehetséges ellenőrizni, igazolást kérni arról, hogy az adott kérés valóban az Unas forrásból érkezik, ezzel kivédhetők a MITM (Man In The Middle) típusú támadások. Ehhez egy hash alapú ellenőrzést biztosítunk, alább látható egy PHP mintakód, mellyel elvégezhető az ellenőrzés.

<?php
define('HMAC_SECRET', 'hmac_secret');

function verify_webhook($json, $hmac_header) {
	$hmac = base64_encode(hash_hmac('sha256', $json, HMAC_SECRET, true));
	return hash_equals($hmac_header, $hmac);
}

$hmac_header = $_SERVER['HTTP_X_UNAS_HMAC'];
$json = file_get_contents('php://input');

if (verify_webhook($json, $hmac_header)){
	//Webhook verified
}
Példák
Folyamat létrehozása - első példa
Az alábbi setAutomatism kérés létrehoz egy automata folyamatot, amely egy megrendelés leadás esemény hatására kiküld egy emailt a megrendelést leadó vásárlónak. A folyamat azonnali esemény, tehát a vásárló a megrendelés leadását követően max. 5 percen belül megkapja az e-mailt. Az e-mail sablon tetszőleges, a példában a neve "Megrendelést adtál le", azonosítója 64138. Az eseményhez tartozó szabályok jelenleg nem kerültek meghatározásra, így minden megrendelés leadáskor a vásárlónak küldi a rendszer az e-mailt.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
	    <Action>add</Action>
		<Name><![CDATA[Megrendelést leadás - E-mail küldése a vásárlónak]]></Name>
		<Active>yes</Active>
		<Schedule>
			<Type>instant</Type>
		</Schedule>
		<Event>
			<Type>order_send</Type>
		</Event>
		<Operation>
			<Type>email</Type>
			<Config>
				<NewsletterTemplate>
					<Id>64138</Id>
					<Name><![CDATA[Megrendelést adtál le]]></Name>
				</NewsletterTemplate>
			</Config>
		</Operation>
	</Automatism>
</Automatisms>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
		<Action>add</Action>
		<Id>1242</Id>
		<Status>ok</Status>
	</Automatism>
</Automatisms>


Folyamat létrehozása - második példa
Ebben a példában egy elhagyott kosár esemény hatására egy időzített automata folyamat jön létre. A művelet e-mail küldés, viszont ebben a folyamatban egy meghatározott email címre küldi ki a rendszer a választott e-mail sablont. A példában láthatóak meghatározott szabályok, melyek alapján a hírlevélre feliratkozott vásárlók elhagyott kosarairól küld a webáruház emailt, a meghatározott e-mail címre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
	    <Action>add</Action>
		<Name><![CDATA[Kosár elhagyás - időzített, 45 perc]]></Name>
		<Active>yes</Active>
		<Schedule>
			<Type>delayed</Type>
			<Unit>minute</Unit>
			<Value><![CDATA[45]]></Value>
		</Schedule>
		<Event>
			<Type>abandoned_cart</Type>
			<Rules>
				<Rule>
					<Entity>newsletter_up</Entity>
					<Relation>equal</Relation>
					<Values>
						<Value><![CDATA[yes]]></Value>
					</Values>
				</Rule>
			</Rules>
		</Event>
		<Operation>
			<Type>email</Type>
			<Config>
				<NewsletterTemplate>
					<Id>78669</Id>
					<Name><![CDATA[Kosár elhagyás]]></Name>
				</NewsletterTemplate>
				<DirectUser>yes</DirectUser>
				<DirectUserEmails>
					<DirectUserEmail><![CDATA[admin@peldashop.hu]]></DirectUserEmail>
				</DirectUserEmails>
			</Config>
		</Operation>
	</Automatism>
</Automatisms>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
		<Action>add</Action>
		<Id>1243</Id>
		<Status>ok</Status>
	</Automatism>
</Automatisms>


Folyamat létrehozása - harmadik példa
Az alábbi XML egy automata folyamatot hoz létre, amelynél az esemény vásárló regisztráció, a műveletet azonnal elvégzi a webáruház, ami vásárló csoportba helyezést jelent. Az eseményhez tartozó szabály úgy került megadásra, hogy ha a vásárló szállítási megyéje Győr-Moson-Sopron, Vas vagy Zala és a vásárló települése nem Kóny, Zalakaros vagy Ostffyasszonyfa akkor áthelyezésre kerül a Csoport 1 nevű vásárló csoportba.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
	    <Action>add</Action>
		<Name><![CDATA[Vásárló regisztráció - Vásárló csoportba helyezés]]></Name>
		<Active>yes</Active>
		<Schedule>
			<Type>instant</Type>
		</Schedule>
		<Event>
			<Type>customer_registration</Type>
			<Rules>
				<Rule>
					<Entity>customer_shipping_county</Entity>
					<Relation>equal</Relation>
					<Values>
						<Value><![CDATA[Győr-Moson-Sopron]]></Value>
						<Value><![CDATA[Vas]]></Value>
						<Value><![CDATA[Zala]]></Value>
					</Values>
				</Rule>
				<Rule>
					<Entity>customer_shipping_city</Entity>
					<Relation>not_equal</Relation>
					<Values>
						<Value><![CDATA[Kóny]]></Value>
						<Value><![CDATA[Zalakaros]]></Value>
						<Value><![CDATA[Ostffyasszonyfa]]></Value>
					</Values>
				</Rule>
			</Rules>
		</Event>
		<Operation>
			<Type>change_customer_group</Type>
			<Config>
				<CustomerGroup>
					<Id>25481</Id>
					<Name><![CDATA[Csoport 1]]></Name>
				</CustomerGroup>
			</Config>
		</Operation>
	</Automatism>
</Automatisms>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
		<Action>add</Action>
		<Id>1244</Id>
		<Status>ok</Status>
	</Automatism>
</Automatisms>


Folyamat létrehozása - negyedik példa
A negyedik példában egy Webhook művelet beállítását láthatod. Vásárló törlés esemény hatására a beállított webhook URL-re POST kérést intéz rendszerünk. A POST kérésben a vásárló azonosítója szerepel, az esemény vásárló törlése. Így a külső rendszer a hívás fogadásakor felkészíthető, hogy ott is törlésre kerüljön az adott vásárló.
A Webhook művelet során a fogadó oldalnak HTTP 200 OK válasz üzenettel kell jeleznie, hogy fogadta és feldolgozta a webhook hívást. Egyéb esetben rendszerünk hibás webhook hívást rögzít, majd újra ütemezi öt perccel későbbre. Összesen öt alkalommal ütemezzük újra a webhook hívásokat, az ötödik alkalom után a folyamat elhal. Fogadó oldalon a Webhook hívások ellenőrizhetők, erről a Webhook ellenőrzés fejezetben olvashatsz bővebben.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
	    <Action>add</Action>
		<Name><![CDATA[Vásárló törlés - Webook esemény]]></Name>
		<Active>yes</Active>
		<Schedule>
			<Type>instant</Type>
		</Schedule>
		<Event>
			<Type>customer_delete</Type>
		</Event>
		<Operation>
			<Type>webhook</Type>
			<Config>
				<WebhookUrl><![CDATA[https://example.com/recieve_webhook.php]]></WebhookUrl>
			</Config>
		</Operation>
	</Automatism>
</Automatisms>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
		<Action>add</Action>
		<Id>1245</Id>
		<Status>ok</Status>
	</Automatism>
</Automatisms>


Automata folyamatok törlése
Az alábbi példakódban automata folyamatok törlését láthatod. A kérésben több automata folyamat azonosítója szerepel, így látható, hogy miként lehet egy kérésben több folyamatot is törölni.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
	    <Action>delete</Action>
		<Id>1203</Id>
	</Automatism>
	<Automatism>
	    <Action>delete</Action>
		<Id>1196</Id>
	</Automatism>
	<Automatism>
	    <Action>delete</Action>
		<Id>1188</Id>
	</Automatism>
</Automatisms>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Automatisms>
	<Automatism>
		<Action>delete</Action>
		<Id>1203</Id>
		<Status>ok</Status>
	</Automatism>
	<Automatism>
		<Action>delete</Action>
		<Id>1196</Id>
		<Status>ok</Status>
	</Automatism>
	<Automatism>
		<Action>delete</Action>
		<Id>1188</Id>
		<Status>ok</Status>
	</Automatism>
</Automatisms>
Megrendelés státuszok
A webáruházban a megrendelések különböző státuszban lehetnek. A beállítható státuszokat ezekkel a végpontokkal lehet létrehozni, módosítani, törölni.
Egy konkrét megrendelés státuszát lekérdezni és módosítani a getOrder és setOrder végpont segítségével lehet!
getOrderStatus
A getOrderStatus végponttal listázhatók az áruházban megtalálható megrendelés státuszok, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getOrderStatus
A getOrderStatus kérésben láthatod, hogy milyen módon lehet az megrendelés státuszokat lekérdezni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setOrderStatus
A setOrderStatus végpont segítségével tudod a megrendelés státuszokat létrehozni, módosítani illetve törölni a webáruházadból.
Végpont: https://api.unas.eu/shop/setOrderStatus
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setOrderStatus kérést, melynek válaszát a setOrderStatus válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getOrderStatus kérés
getOrderStatus kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd a megrendelés státuszokat listázni. A getOrderStatus kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
Az egyedi azonosítója alapján kérdezhetsz le egy státuszt.
Type   enum
Csak a meghatározott típusú rendelés státuszok fognak szerepelni a válaszban.
használható értékek
open_normal Normál nyitott
close_ok Sikeresen lezárult
close_fault Sikertelenül lezárult
open_prepare Feldolgozáson kívüli
getOrderStatus válasz
A getOrderStatus kérésre kapott válasz adatainak és azok struktúrális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setOrderStatus kérés
A setOrderStatus kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setOrderStatus válasz
A setOrderStatus válaszban láthatod az információkat a módosított, létrehozott illetve törölt megrendelés státuszokról. A válasz az alábbi mezőket tartalmazhatja.
Action   enum
Az API híváshoz tartozó műveletet írja le. Az alábbi műveletekről kapsz visszajelzést az API válaszban.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely vagy sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A megrendelés státuszokat az alább látható adatszerkezet segítségével tudod kezelni. Az itt látható módon kell kérést intézni a szerverhez, ahol az egyes mezőkhöz külön található leírás arról, hogy melyik adattag használható a getOrderStatus illetve setOrderStatus végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setOrderStatus kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A megrendelés státusz egyedi azonosítója. SET végpontnál csak azonosító adatként használható, nem módosítható.
Name   string GET SET
Az megrendelés státusz neve. Két ugyanolyan nevű státuszt nem lehet létrehozni.
Type   enum GET SET
A megrendelés státusz típusa.
Használható értékek
open_normal Normál nyitott
close_ok Sikeresen lezárult
close_fault Sikertelenül lezárult
open_prepare Feldolgozáson kívüli (csak VIP csomaggal)
OrderType   string GET SET
A megrendelés státuszhoz megadható megrendelés típust kezelheted vele, setOrderStatus hívás esetén az áruházban létrehozott típusok használhatók.
Order   int GET SET
A megrendelés státusz sorrendjét lehet kezelni vele.
Text   string GET SET
Plusz információ a megrendelés státuszhoz (bekerül a státusz módosítás értesítő emailbe is).
Alert   object GET SET
A megrendelés státuszhoz beállított értesítések kezelése.
Alert.Email   enum GET SET
Email-es értesítés adattagja.
Használható értékek
yes Igen
no Nem
Alert.SMS   enum GET SET
SMS alapú értesítés adattagja. Értéke csak akkor lehet "yes", ha az Email-es értesítés is be van kapcsolva!
Használható értékek
yes Igen
no Nem
InvoiceStatus   enum GET SET
A megrendelés státuszhoz tartozó számlázási státusz értéke, az adott megrendelés ezen státuszba váltásakor a rendelés számlázási státusza vált erre az értékre.
Használható értékek
default Alapértelmezett - nem változik
not_billable Nem számlázható
billable Számlázható
billed Számlázva
Color   enum GET SET
A megrendelés státuszhoz tartozó, adminisztrációs felületen a rendelés listában megjelenő színkód értéke.
Használható értékek
not_specified Alapértelmezett - nincs megadva
1 Színkód: #FFAEAE
2 Színkód: #AEFFAE
3 Színkód: #AEAEFF
4 Színkód: #FFFFAE
5 Színkód: #FFAEFF
6 Színkód: #AEFFFF
7 Színkód: #FFC674
8 Színkód: #86A6F6
9 Színkód: #8BC99E
10 Színkód: #DD743B
11 Színkód: #E7D35F
12 Színkód: #DBEA5C
13 Színkód: #5DEFBA
14 Színkód: #AA9EEB
15 Színkód: #DF9EEB
16 Színkód: #D3F8CB
17 Színkód: #F95C88
18 Színkód: #FDD3DF
19 Színkód: #F9FFD5
StockColor   enum GET SET
A megrendelés státuszhoz tartozó, raktárkezelésnél az adminisztrációs felületen használt színkód értéke.
Használható értékek
not_specified Alapértelmezett - nincs megadva
1 Színkód: #FFAEAE
2 Színkód: #AEFFAE
3 Színkód: #AEAEFF
4 Színkód: #FFFFAE
5 Színkód: #FFAEFF
6 Színkód: #AEFFFF
7 Színkód: #FFC674
8 Színkód: #86A6F6
9 Színkód: #8BC99E
10 Színkód: #DD743B
11 Színkód: #E7D35F
12 Színkód: #DBEA5C
13 Színkód: #5DEFBA
14 Színkód: #AA9EEB
15 Színkód: #DF9EEB
16 Színkód: #D3F8CB
17 Színkód: #F95C88
18 Színkód: #FDD3DF
19 Színkód: #F9FFD5
Creation   string GET
Megrendelés státusz létrehozásának időpontja.
Modification   string GET
Megrendelés státusz utolsó módosításának időpontja.
Példák
Megrendelés státusz lekérdezése
Az alábbi getOrderStatus kérés egy konkrét megrendelés státusz adatait kérdezi le ID alapján.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>12345</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<OrderStatuses>
	<OrderStatus>
		<Id>12345</Id>
		<Name><![CDATA[Sikertelenül lezárult]]></Name>
		<Order>7</Order>
		<Text>A megrendelés sikertelenül lezárult!</Text>
		<Alert>
			<Email>yes</Email>
			<SMS>no</SMS>
		</Alert>
		<InvoiceStatus>default</InvoiceStatus>
		<Color>17</Color>
		<StockColor>not_specified</StockColor>
		<Creation>2022.01.01 12:00:00</Creation>
		<Modification>2022.03.01 14:00:00</Modification>
	</OrderStatus>
</OrderStatuses>


Megrendelés státusz létrehozása
Az alábbi setOrderStatus kérés létrehoz egy megrendelés státuszt a megadott értékekkel, paraméterekkel.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<OrderStatuses>
	<OrderStatus>
		<Name><![CDATA[Sikeresen lezárult]]></Name>
		<Type>close_ok</Type>
		<Order>5</Order>
		<Text><![CDATA[Megrendelésed átadtuk a futárszolgálatnak, köszönjük hogy nálunk vásároltál.]]></Text>
		<Alert>
			<Email>yes</Email>
			<SMS>no</SMS>
		</Alert>
		<InvoiceStatus>billable</InvoiceStatus>
		<Color>2</Color>
		<StockColor>not_specified</StockColor>
	</OrderStatus>
</OrderStatuses>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<OrderStatuses>
	<OrderStatus>
		<Action>add</Action>
		<Id>12345</Id>
		<Status>ok</Status>
	</OrderStatus>
</OrderStatuses>


Megrendelés státusz törlése
Az alábbi példakódban egy megrendelés státusz törlését láthatod.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<OrderStatuses>
	<OrderStatus>
	    <Action>delete</Action>
		<Id>67890</Id>
	</OrderStatus>
</OrderStatuses>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<OrderStatuses>
	<OrderStatus>
		<Action>delete</Action>
		<Id>1203</Id>
		<Status>ok</Status>
	</OrderStatus>
</OrderStatuses>
Kuponok
A marketingben a kupon egy olyan jegy, amit árengedményként válthatnak be vásárlás során az azzal rendelkező vevők. Vásárlásösztönzés gyanánt ilyen kuponokat bocsátanak ki üzletláncok, kis- és nagykereskedések és más forgalmazók, hogy termékeik iránt nagyobb kereslet keletkezzen. Ideális és viszonylag olcsó marketing eszköz, melynek segítségével növelheted vállalkozásod bevételeit.
getCoupon
A getCoupon végponttal listázhatók az áruházban megtalálható kuponok, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getCoupon
A getCoupon kérésben láthatod, hogy milyen módon lehet a kuponokat lekérdezni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setCoupon
A setCoupon végpont segítségével tudod a kuponokat létrehozni, módosítani illetve törölni a webáruházadból.
Végpont: https://api.unas.eu/shop/setCoupon
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setCoupon kérést, melynek válaszát a setCoupon válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getCoupon kérés
getCoupon kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd a kuponokat listázni. A getCoupon kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   string
Az egyedi azonosítója alapján kérdezhetsz le egy kupont.
LimitNum  
Meghatározhatod, hogy mennyi kupont szeretnél listázni.
LimitStart  
Ha nem az összes kupont szeretnéd a GET válaszban szerepeltetni, itt határozhatod meg, hogy hányadik kupontól induljon a letöltés. Pozitív egész szám, csak a LimitNum paraméterrel együtt használható.
getCoupon válasz
A getCoupon kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCoupon kérés
A setCoupon kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setCoupon válasz
A setCoupon válaszban láthatod az információkat a módosított, létrehozott illetve törölt kuponokról. A válasz az alábbi mezőket tartalmazhatja.
Action   enum
Az API híváshoz tartozó műveletet írja le. Az alábbi műveletekről kapsz visszajelzést az API válaszban.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely vagy sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A kuponokat az alább látható adatszerkezet segítségével tudod kezelni. Az itt látható módon kell kérést intézni a szerverhez, ahol az egyes mezőkhöz külön található leírás arról, hogy melyik adattag használható a getCoupon illetve setCoupon végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setCoupon kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   string GET SET
A kupon egyedi azonosítója, mely egyben a kódja is. SET végpontnál, új kupon létrehozása esetén kötelezően megadható elem, míg meglévő kupon módosítása során csak azonosító adatként használható, nem módosítható.
BaseType   string GET SET
A kupon típusa.
Használható értékek
product Termék kedvezmény
total Végösszeg kedvezmény
shipping Ingyenes szállítás
gitfcard Ajándékkártya
Type   enum GET SET
A kupon jellege.

FONTOS megkötések az adattag használatára vonatkozóan:
Ingyenes szállítás és ajándékkártya típus esetén nincs értelmezve.
Végösszeg kedvezmény típus esetén CSAK [amount] és [percent] használható.
A speciális százalékos opciók CSAK termék kedvezmény típus esetén használhatók!
Használható értékek
amount Összegszerű (A kupon kedvezmények összege maximum a megadott összeg lehet)
amount_multi Összegszerű (Minden terméknél külön-külön felhasználható)
percent Százalékos
percent_mostexpensive Százalékos (a termék árától függően) - Csak a legmagasabb egységárú termék teljes mennyiségére
percent_mostexpensive_one Százalékos (a termék árától függően) - Csak a legmagasabb egységárú termékből 1db-ra
percent_mostexpensive_item Százalékos (a termék árától függően) - Csak a legmagasabb összértékű tételre
percent_cheapest Százalékos (a termék árától függően) - Csak a legalacsonyabb egységárú termék teljes mennyiségére
percent_cheapest_one Százalékos (a termék árától függően) - Csak a legalacsonyabb egységárú termékből 1db-ra
percent_cheapest_item Százalékos (a termék árától függően) - Csak a legalacsonyabb összértékű tételre


Template   object GET SET
Az adott kupon sablon-e a rendszerben vagy sem. Kupon sablon közvetlenül nem érvényesíthető vagy használható fel, de készíthető belőle manuálisan vagy automatikusan normál kupon. Meglévő kupon esetén nem módosítható.
SendOrderStatus   enum GET SET
Csak kuponsablon esetén értelmezett. Automatikus kupon generálás során megadható, hogy melyik rendelési státuszba váltás során generálódjon a tényleges kupon a sablonból.
Value   enum GET SET
A kupon értéke. Ingyenes szállítás típus esetén nincs értelmezve.
UsedAmount   integer GET SET
Ajándékkártya típus esetén értelmezett. A kiállított kupon felhasznált értékét mutatja.
OrderKey   object GET SET
Ajándékkártya típus esetén értelmezett. Azon rendelés azonosítóját tartalmazza, melyben a kupont érvényesítette a vásárló.
PercentMaximumValue   enum GET SET
Százalékos jelleg esetén a kupon kedvezmény maximális értéke.
DateStart   object GET SET
Kupon érvényességi idejének kezdő dátuma.
DateEnd   object GET SET
Kupon érvényességi idejének lejárati dátuma.
MaxUsabilityInOrders   object GET SET
A kupon mennyi rendelésben érvényesíthető összesen.
MaxUsabilityPerCustomer   enum GET SET
Egy vásárló mennyi rendelésben használhatja fel a kupont.
UsabilityForNewCustomers   enum GET SET
Új vásárló használhatja-e a kupont vagy sem (azaz első rendelés során érvényesíthető-e a kupon).
CustomerTypes   object GET SET
A kupon mely vásárló típushoz van rendelve.
CustomerTypes.CustomerType   enum GET SET
A konkrét vásárló típus.
Használható értékek
private Magánszemély
company Cég
other_customer_without_tax_number Egyéb, adószámmal nem rendelkező vásárló
MinimumOrderValue   object GET SET
Milyen rendelési összeg felett lehessen felhasználni a kupont.
MinimumOrderValueByProducts   string GET SET
Mennyi legyen a kupon által érintett termékek összege a kosárban a kupon érvényre jutásához.
MinimumItemCount   object GET SET
Legalább ennyi tételnek kell a kosárban lennie, hogy felhasználható legyen.
AllowedForSubscriber   enum GET SET
Csak hírlevélre feliratkozó használhatja-e fel a kupont vagy sem.
Használható értékek
everyone Nem, mindenki felhasználhatja.
registered_and_subscribed Igen, csak regisztrált vásárlóként feliratkozó használhatja.
subscribed Igen, bármilyen feliratkozó használhatja.
Customer   object GET SET
Kupon vásárlóhoz kötése (email cím).
Groups   object GET SET
Vásárló csoporthoz kötött kuponok esetén találhatók meg ez alatt a konkrét csoport adatok.
Groups.Group   object GET SET
Egy konkrét vásárló csoport adatai.
Groups.Group.Id   object GET SET
Egy konkrét vásárló csoport azonosítója az áruházban.
Groups.Group.Name   object GET
Egy konkrét vásárló csoport neve az áruházban.
Search   integer GET SET
Azon kereső kifejezés, ami szerepel a termék nevében, melyre érvényesa kupon.
Comment   string GET
Adminisztrátori megjegyzés.
Notification   enum GET SET
Ajándékkártya esetén értelmezett, a vásárló számára kiküldött emailben ez a plusz tartalom jelenik meg a kupon kódja mellett.
DisableForSaleProducts   object GET SET
Akciós termékre a kupon beváltható-e vagy sem.
DisableWhenQtyDiscount   string GET SET
Mennyiségi kedvezmény esetén a kupon beváltható-e vagy sem.
DisableWhenPointUse   string GET SET
Pontfelhasználás esetén a kupon beváltható-e vagy sem.
DisableOnSale   object GET SET
Csak végösszeg kedvezmény esetén értelmezett. Ha akciós termék is van a kosárban a végösszeg kupon beváltható-e vagy sem.
UsableFor   object GET SET
Csak termék kedvezmény típus esetén értelmezett. Megadható, hogy konkrétan melyik termékre vagy kategóriára legyen érvényesíthető a kupon.
UsableFor.Products   object GET SET
Mely termékekre érvényesíthető a kupon.
UsableFor.Products.Product   object GET SET
Egy konkrét termék adatai, melyre érvényesíthető a kupon.
UsableFor.Products.Product.Sku   object GET SET
A termék cikkszáma.
UsableFor.Products.Product.Name   object GET
A termék neve.
UsableFor.Categories   object GET SET
Mely kategóriák termékeire érvényesíthető a kupon.
UsableFor.Categories.Category   object GET SET
Egy konkrét kategória adatai, melynek termékeire érvényesíthető a kupon.
UsableFor.Categories.Category.Id   object GET SET
A kategória azonosítója.
UsableFor.Categories.Category.Name   object GET
A kategória neve.
CouponUrl   string GET
A kupon közvetlen URL-je, melyen keresztül egyből érvényesíthető a kupon az áruházban (pl. landing page-ek, hírlevelek használata során a vásárló átirányításával).
CreateTime   string GET
A kupon generálás időpontja timestamp-ként megjelenítve.
Példák
Kupon lekérdezése
Az alábbi getCoupon kérés egy konkrét kupon adatait kérdezi le azonosító alapján.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>12345</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<?xml version="1.0" encoding="UTF-8" ?>
<Coupons>
	<Coupon>
		<Id><![CDATA[12345]]></Id>
		<BaseType>product</BaseType>
		<Type>amount</Type>
		<Template>no</Template>
		<Value>1.234</Value>
		<DateStart>2023.01.01</DateStart>
		<DateEnd>2023.02.01</DateEnd>
		<MaxUsabilityInOrders>1</MaxUsabilityInOrders>
		<MaxUsabilityPerCustomer>1</MaxUsabilityPerCustomer>
		<UsabilityForNewCustomers>everyone</UsabilityForNewCustomers>
		<MinimumOrderValue>1000</MinimumOrderValue>
		<MinimumItemCount>1</MinimumItemCount>
		<AllowedForSubscriber>registered_and_subscribed</AllowedForSubscriber>
		<Groups>
			<Group>
				<Id>987</Id>
				<Name><![CDATA[vásárló csoport 1]]></Name>
			</Group>
			<Group>
				<Id>988</Id>
				<Name><![CDATA[vásárló csoport 2]]></Name>
			</Group>
		</Groups>
		<Comment><![CDATA[adminisztrátori megjegyzés]]></Comment>
		<DisableForSaleProducts>yes</DisableForSaleProducts>
		<DisableWhenQtyDiscount>yes</DisableWhenQtyDiscount>
		<DisableWhenPointUse>yes</DisableWhenPointUse>
		<UsableFor>
			<Products>
				<Product>
					<Sku><![CDATA[cikk1]]></Sku>
					<Name><![CDATA[Fejhallgató]]></Name>
				</Product>
				<Product>
					<Sku><![CDATA[cikk2]]></Sku>
					<Name><![CDATA[Fülhallgató]]></Name>
				</Product>
			</Products>
		</UsableFor>
		<CouponUrl><![CDATA[http://unas.hu/?coupon_id=12345]]></CouponUrl>
	</Coupon>
</Coupons>


Kupon létrehozása
Az alábbi setCoupon kérés létrehoz egy kupont a megadott értékekkel, paraméterekkel.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Coupons>
	<Coupon>
        <Action>add</Action>
		<Id><![CDATA[67890]]></Id>
		<BaseType>product</BaseType>
		<Type>amount</Type>
		<Template>no</Template>
		<Value>1.234</Value>
		<DateStart>2023.01.01</DateStart>
		<DateEnd>2023.02.01</DateEnd>
		<MaxUsabilityInOrders>2</MaxUsabilityInOrders>
		<MaxUsabilityPerCustomer>2</MaxUsabilityPerCustomer>
		<UsabilityForNewCustomers>everyone</UsabilityForNewCustomers>
		<MinimumItemCount>1</MinimumItemCount>
		<AllowedForSubscriber>registered_and_subscribed</AllowedForSubscriber>
		<DisableForSaleProducts>yes</DisableForSaleProducts>
		<DisableWhenQtyDiscount>yes</DisableWhenQtyDiscount>
		<DisableWhenPointUse>yes</DisableWhenPointUse>
	</Coupon>
</Coupons>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Coupons>
	<Coupon>
		<Id>67890</Id>
		<Action>add</Action>
		<Status>ok</Status>
	</Coupon>
</Coupons>


Kupon törlése
Az alábbi példakódban egy kupon törlését láthatod.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Coupons>
	<Coupon>
        	<Action>delete</Action>
		<Id><![CDATA[67890]]></Id>
	</Coupon>
</Coupons>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Coupons>
	<Coupon>
		<Action>delete</Action>
		<Id>67890</Id>
		<Status>ok</Status>
	</Coupon>
</Coupons>
Fizetési és szállítási módok
Egyetlen webáruház sem létezhet fizetési és szállítási mód nélkül, ha úgy tetszik, az online értékesítés egyik fő pillére az áruházban kezelt és vásárlók által választható módok listája. A különböző fizetési és szállítási módokat lehetséges ezen végpontok használatával létrehozni, módosítani vagy akár törölni.
getMethod
A getMethod végponttal listázhatók az áruházban elérhető különböző módok, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getMethod
A getMethod kérésben láthatod, hogy milyen módon lehet a fizetési és szállítási módokat lekérdezni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setMethod
A setMethod végpont segítségével tudod a fizetési és szállítási módokat létrehozni, módosítani illetve törölni a webáruházadból.
Végpont: https://api.unas.eu/shop/setMethod
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setMethod kérést, melynek válaszát a setMethod válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getMethod kérés
getMethod kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd a módokat listázni. A getMethod kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
Az egyedi azonosítója alapján kérdezhetsz le egy módot.
Type   string
A típusa alapján kérdezhetsz le módokat.
Használható értékek
payment Fizetési módok
shipping Szállítási módok
getMethod válasz
A getMethod kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setMethod kérés
A setMethod kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setMethod válasz
A setMethod válaszban láthatod az információkat a módosított, létrehozott illetve törölt fizetési illetve szállítási módokról. A válasz az alábbi mezőket tartalmazhatja.
Action   enum
Az API híváshoz tartozó műveletet írja le. Az alábbi műveletekről kapsz visszajelzést az API válaszban.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely vagy sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A fizetési és szállítási módokat az alább látható adatszerkezet segítségével tudod kezelni. Az itt látható módon kell kérést intézni a szerverhez, ahol az egyes mezőkhöz külön található leírás arról, hogy melyik adattag használható a getMethod illetve setMethod végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Action   enum SET
A setMethod kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A mód egyedi azonosítója. SET végpontnál, új mód létrehozása esetén kötelezően megadható elem, míg meglévő mód módosítása során csak azonosító adatként használható, nem módosítható.
ProviderId   string GET
A fizetési és szállítási módhoz kapcsolódó szolgáltató azonosítója (pl. gls_hu vagy otp_hu).
Name   string GET SET
A mód megnevezése.
Active   string GET SET
A mód állapota, miszerint aktív (választható) vagy sem az áruházban.
Type   string GET SET
A mód típusa.
Használható értékek
payment Fizetési mód
shipping Szállítási mód
SubType   string GET SET
A fizetési mód típusa (szállítási módnál nem értelmezett!).
Használható értékek
transfer Átutalás
cash Készpénz
cod Utánvét
check Csekk
credit Áruhitel
bankcard Bankkártya
popup Bankkártya (megjelenését tekintve az áruház felületén felugró ablakban)
coupon Kupon
bnpl Halasztott fizetés (Buy Now Pay Later)
qvik Qvik (QR kód, link)
bankcard_qvik Bankkártya vagy qvik
Text   string GET SET
A módhoz tartozó, vásárlók által is látható rövid leírás.
AlterText   string GET SET
A módhoz tartozó alternatív leírás, mely a megrendelés visszaigazoló emailben jelenik meg.
Order   integer GET SET
A vásárló felületen a választható módok listájának sorrendjét meghatározó érték.
OrderStatus   integer GET SET
Ha a megrendeléshez ezt a módot választja a vásárló, akkor a kiválasztott státuszba kerül a megrendelés.
OrderType   string GET SET
Ha az adott mód csak bizonyos megrendelés típus esetén alkalmazható, azt ezen adat tartalmazza.
ForeignKey   string GET SET
A módhoz tartozó külső azonosító.
DisplayOnContactPage   string GET SET
Az adott mód megjelenik-e az Információk oldalon.
Használható értékek
yes Igen
yes_force Igen, még akkor is, ha nem aktív
no Nem
Tax   float GET SET
A módhoz tartozó ÁFA kulcs (0 és 100 közötti érték lehet).
PaymentHandlingOnNewOrder   string GET SET
A fizetési mód választása során egy új rendelés rögzítésekor be legyen kapcsolva automatikusan a fizetés kezelés vagy sem (szállítási módnál nem értelmezett!).
Használható értékek
default Áruházi alapbeállítás
yes Igen
no Nem
DeliveryPointGroup   string GET SET
A szállítási módhoz tartozó átvételi pont csoport azonosítója (fizetési módnál nem értelmezett!).
DeliveryPointGroupName   string GET
A szállítási módhoz tartozó átvételi pont csoport neve (fizetési módnál nem értelmezett!).
Weight   float GET SET
A szállítási módhoz tartozó tömeg, mint a csomagolás tömege (fizetési módnál nem értelmezett!).
Limitations   object GET SET
A módhoz tartozó különböző korlátozások.
Limitations.MinWeight   float GET SET
A módhoz tartozó megengedett minimum tömeg.
Limitations.MaxWeight   float GET SET
A módhoz tartozó megengedett maximum tömeg.
Limitations.MinPrice   float GET SET
A módhoz tartozó megengedett minimum rendelési összeg.
Limitations.MaxPrice   float GET SET
A módhoz tartozó megengedett maximum rendelési összeg.
Limitations.MinVolume   float GET SET
A szállítási módhoz tartozó megengedett minimum térfogat (fizetési módnál nem értelmezett!).
Limitations.MaxVolume   float GET SET
A szállítási módhoz tartozó megengedett maximum térfogat (fizetési módnál nem értelmezett!).
Limitations.MinWidth   float GET SET
A szállítási módhoz tartozó megengedett minimum szélesség (fizetési módnál nem értelmezett!).
Limitations.MaxWidth   float GET SET
A szállítási módhoz tartozó megengedett maximum szélesség (fizetési módnál nem értelmezett!).
Limitations.MinHeight   float GET SET
A szállítási módhoz tartozó megengedett minimum magasság (fizetési módnál nem értelmezett!).
Limitations.MaxHeight   float GET SET
A szállítási módhoz tartozó megengedett maximum magasság (fizetési módnál nem értelmezett!).
Limitations.MinDepth   float GET SET
A szállítási módhoz tartozó megengedett minimum hosszúság (fizetési módnál nem értelmezett!).
Limitations.MaxDepth   float GET SET
A szállítási módhoz tartozó megengedett maximum hosszúság (fizetési módnál nem értelmezett!).
Limitations.Area   object GET SET
A módhoz tartozó területi korlátozás.
Limitations.Area.Name   string GET SET
A módhoz tartozó területi korlátozás megnevezése.
Limitations.Currency   string GET SET
A fizetési módhoz tartozó pénznem, csak ennek választása esetén alkalmazható a mód a megrendelés során (szállítási módnál nem értelmezett!).
Limitations.AllProductIsOnStock   string GET SET
Adott mód csak akkor választható a megrendelési folyamatban, ha minden kosárban levő termék van raktáron.
Limitations.NotAllProductIsOnStock   string GET SET
Adott mód csak akkor választható a megrendelési folyamatban, ha van olyan termék a kosárban, ami nincs raktáron.
Limitations.Dates   object GET SET
A módhoz tartozó időbeli korlátozás.
Limitations.Dates.Date   object GET SET
Egy konkrét idő sáv adatait tartalmazza.
Limitations.Dates.Date.Start   date GET SET
Az időbeli korlát kezdeti időpontja, az elvárt formátum YYYY.MM.DD. HH:MM:SS. Ha nincs meghatározva (nyitott intervallum), akkor egy kötőjelet kell megadni értékként.
Limitations.Dates.Date.End   date GET SET
Az időbeli korlát végidőpontja, az elvárt formátum YYYY.MM.DD. HH:MM:SS. Ha nincs meghatározva (nyitott intervallum), akkor egy kötőjelet kell megadni értékként.
Limitations.CustomerGroups   object GET SET
A módhoz tartozó vásárló csoport szintű korlátozás (csak adott csoport vásárlói számára elérhető a mód).
Limitations.CustomerGroups.CustomerGroup   object GET SET
Egy konkrét vásárló csoport.
Limitations.CustomerGroups.CustomerGroup.Id   integer GET SET
A vásárló csoport azonosítója.
Limitations.CustomerGroups.CustomerGroup.Name   string GET SET
A vásárló csoport neve.
Limitations.CustomerTypes   object GET SET
A módhoz tartozó vásárló típus alapú korlátozás.
Limitations.CustomerTypes.CustomerType   string GET SET
Egy adott vásárló típus.
Használható értékek
private Magánszemély
company Cég
other_customer_without_tax_number Egyéb, adószámmal nem rendelkező vásárló
Limitations.AvailableInLanguages   object GET SET
A módhoz tartozó nyelv szintű korlátozás.
Limitations.AvailableInLanguages.Language   string GET SET
Egy adott nyelv (pl. hu, en stb.).
Limitations.UseWithSubscription   string GET SET
Termék előfizetési mol esetén az adott mód hogyan alkalmazható ebből a szempontból. Alapértelmezetten minden esetben használéható, választható a mód a rendelési folyamatban.
Használható értékek
cart_without_subscription Ha nincs előfizetés a kosárban
cart_with_subscription Ha van előfizetés a kosárban
ShippingFee   object GET SET
A szállítási módhoz tartozó szállítási költség (fizetési módnál nem értelmezett!).
ShippingFee.Type   string GET SET
A szállítási módhoz tartozó szállítási költség típusa.
Használható értékek
amount Végösszeg szerinti szállítási költség
weight Tömeg szerinti szállítási költség
product_count Termék mennyiség szerinti szállítási költség
fix_amount Fix szállítási költség
fix_text Fix szöveg megjelenítése a szállítási költségnél
ShippingFee.Fee   object GET SET
A szállítási költséghez tartozó konkrét értékek.
ShippingFee.Fee.LowerLimit   string GET SET
Az amount, weight és product_count szállítási költség típushoz tartozó érték alsó határa (fix_text és fix_amount esetén nincs értelmezve).
ShippingFee.Fee.UpperLimit   string GET SET
Az amount, weight és product_count szállítási költség típushoz tartozó érték felső határa (fix_text és fix_amount esetén nincs értelmezve).
ShippingFee.Fee.Amount   string GET SET
A fix_amount, amount, weight és product_count szállítási költség típushoz tartozó érték.
ShippingFee.Fee.Text   string GET SET
A fix_text szállítási költség típushoz tartozó érték.
AdditionalCosts   object GET SET
A fizetési módhoz tartozó kezelési költség értékek (szállítási módnál nem értelmezett!).
AdditionalCosts.Amount   float GET SET
A fizetési módhoz tartozó összegszerű kezelési költség.
AdditionalCosts.Percent   float GET SET
A fizetési módhoz tartozó százalékos kezelési költség.
AdditionalCosts.Min   float GET SET
A fizetési módhoz tartozó minimális kezelési költség.
AdditionalCosts.Max   float GET SET
A fizetési módhoz tartozó maximum kezelési költség.
Creation   string GET SET
A mód létrehozásának időpontja.
Modification   string GET SET
A mód utolsó módosításának időpontja.
CustomData   string GET
Integráció specifikus adatok.
Példák
Mód lekérdezése
Az alábbi getMethod kérés egy konkrét mód adatait kérdezi le azonosító alapján.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>12345</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Methods>
	<Method>
		<Id>12345</Id>
		<Name><![CDATA[Szállítási mód]]></Name>
		<Active>yes</Active>
		<Type>shipping</Type>
		<Text><![CDATA[leírás]]></Text>
		<AlterText><![CDATA[alternatív leírás]]></AlterText>
		<Order>1</Order>
		<OrderStatus>31974</OrderStatus>
		<OrderType><![CDATA[Visszáru]]></OrderType>
		<ForeignKey><![CDATA[17]]></ForeignKey>
		<DisplayOnContactPage>yes_force</DisplayOnContactPage>
		<Tax>27</Tax>
		<DeliveryPointGroup><![CDATA[Szállítási pontok]]></DeliveryPointGroup>
		<Weight>2</Weight>
		<Limitations>
			<MinWeight>1</MinWeight>
			<MaxWeight>2</MaxWeight>
			<MinPrice>1000</MinPrice>
			<MaxPrice>30000</MaxPrice>
			<Area>
				<Name><![CDATA[Budapest]]></Name>
			</Area>
			<NotAllProductIsOnStock>yes</NotAllProductIsOnStock>
			<CustomerGroups>
				<CustomerGroup>
					<Id>8647</Id>
					<Name><![CDATA[Viszonteladók]]></Name>
				</CustomerGroup>
			</CustomerGroups>
			<CustomerTypes>
				<CustomerType>private</CustomerType>
				<CustomerType>company</CustomerType>
				<CustomerType>other_customer_without_tax_number</CustomerType>
			</CustomerTypes>
			<AvailableInLanguages>
				<Language>hu</Language>
				<Language>en</Language>
				<Language>de</Language>
			</AvailableInLanguages>
		</Limitations>
		<ShippingFee>
			<Type>fix_amount</Type>
			<Fee>
				<Amount>1500</Amount>
			</Fee>
		</ShippingFee>
		<Creation>2023.07.06 09:42:13</Creation>
		<Modification>2023.09.14 15:07:41</Modification>
	</Method>
</Methods>


Mód létrehozása
Az alábbi setMethod kérés létrehoz egy szállítási módot a megadott értékekkel, paraméterekkel.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Methods>
	<Method>
		<Name><![CDATA[Új szállítási mód]]></Name>
		<Active>yes</Active>
		<Type>shipping</Type>
		<Text><![CDATA[Új szállítási mód leírása.]]></Text>
		<AlterText><![CDATA[Új szállítási mód alternatív leírása.]]></AlterText>
		<Order>4</Order>
		<DisplayOnContactPage>yes</DisplayOnContactPage>
		<Tax>27</Tax>
		<ShippingFee>
			<Type>amount</Type>
			<Fee>
				<LowerLimit>0</LowerLimit>
				<UpperLimit>5000</UpperLimit>
				<Amount>1500</Amount>
			</Fee>
			<Fee>
				<LowerLimit>5000</LowerLimit>
				<UpperLimit>10000</UpperLimit>
				<Amount>1000</Amount>
			</Fee>
			<Fee>
				<LowerLimit>10000</LowerLimit>
				<UpperLimit>20000</UpperLimit>
				<Amount>500</Amount>
			</Fee>
			<Fee>
				<LowerLimit>20000</LowerLimit>
				<UpperLimit>-</UpperLimit>
				<Amount>0</Amount>
			</Fee>
		</ShippingFee>
	</Method>
</Methods>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Methods>
	<Method>
		<Id>67890</Id>
		<Action>add</Action>
		<Status>ok</Status>
	</Method>
</Methods>


Mód törlése
Az alábbi példakódban egy mód törlését láthatod.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Methods>
	<Method>
		<Action>delete</Action>
		<Id><![CDATA[67890]]></Id>
	</Method>
</Methods>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Methods>
	<Method>
		<Action>delete</Action>
		<Id>67890</Id>
		<Status>ok</Status>
	</Method>
</Methods>
ovábbi raktárak
Ezen végpontokkal tudsz további raktárakat létrehozni illetve módosítani a webáruházban.
getWarehouse
Az alábbi végpont visszaadja a kérésében meghatározott feltételeknek megfelelő további raktárakat.
Végpont: https://api.unas.eu/shop/getWarehouse
A getWarehouse kérésben láthatod, hogy milyen módon lehet a készletinformációkat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy további raktár lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több további raktár lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setWarehouse
A setWarehouse végpont segítségével további raktárakat tudsz a webáruházadban létrehozni, módosítani illetve törölni.
Végpont: https://api.unas.eu/shop/setWarehouse
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setWarehouse kérést, melynek a válaszát a setWarehouse válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 további raktárat tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 további raktárat tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getWarehouse kérés
GET kérésben határozhatod meg, milyen feltételek alapján szeretnéd a további raktárakat lekérni. A GET kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer
A további raktár egyedi azonosítója.
Name   string
A további raktár neve.
getWarehouse válasz
A getWarehouse kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setWarehouse kérés
A setWarehouse kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setWarehouse válasz
A setWarehouse válaszban láthatod a műveletnek megfelelő információkat, az egyes elemekről bővebben alább találsz információt.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbiak egyike lehet.
add Létrehozás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A további raktárak kezeléshez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getWarehouse kérésre a választ, illetve ilyen formában kell beküldened a setWarehouse kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük, hogy melyik adattag használható a getWarehouse illetve setWarehouse végpontokhoz a GET illetve SET jelölések mentén.
Action   enum SET
A műveletet leíró mező.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A további raktár egyedi azonosítója.
Active   enum GET SET
Ezzel a beállítással vezérelhető az, hogy fogyasztunk-e a további raktárról vagy sem.
Használható értékek
yes no
Name   string GET SET
A további raktár neve.
PublicName   string GET SET
A további raktár publikus neve. Ez jelenik meg a vásárló felületen a termék részletek oldalon a raktár listában.
Order   integer GET SET
A raktárlistában a további raktár sorrendjét határozza meg.
Type   enum GET SET
A további raktár típusa.
Használható értékek
own Saját
external Külső
SyncMainStockDisabled   enum GET SET
A készletmozgás megjelenjen-e a fő raktárkészletben. Alapértelmezetten ez a beállítás be van kapcsolva, tehát megjelenik a készletmozgás a fő raktárkészlet történetben.
Használható értékek
yes no
VisibleOnProductDetails   enum GET SET
A termék részletek oldalon megjelenjen-e a raktárkészlet listában a további raktár.
Használható értékek
yes no
UseFilter   enum GET SET
A termék lista oldalakon külön szűrési opcióként jelenjen-e meg az adott raktár.
Példák
További raktárak lekérdezése név alapján
Az alábbi getWarehouse kérésben a Raktár 1 nevű további raktárat kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Name>Raktár 1</Name>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Warehouses>
	<Warehouse>
		<Id>4590231</Id>
		<Active>yes</Active>
		<Name><![CDATA[Raktár 1]]></Name>
		<PublicName><![CDATA[Raktár 1]]></PublicName>
		<Order>1</Order>
		<Type>external</Type>
		<SyncMainStockDisabled>yes</SyncMainStockDisabled>
		<VisibleOnProductDetails>yes</VisibleOnProductDetails>
	</Warehouse>
</Warehouses>	


További raktárak lekérdezése egyedi azonosító alapján
Az alábbi getWarehouse kérésben a 4590241 egyedi azonosítójú további raktárat kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Id>4590241</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Warehouses>
	<Warehouse>
		<Id>4590231</Id>
		<Active>yes</Active>
		<Name><![CDATA[Raktár 3]]></Name>
		<PublicName><![CDATA[Raktár 3]]></PublicName>
		<Order>3</Order>
		<Type>own</Type>
		<SyncMainStockDisabled>no</SyncMainStockDisabled>
		<VisibleOnProductDetails>yes</VisibleOnProductDetails>
	</Warehouse>
</Warehouses>	


További raktár létrehozása
Az alábbi setWarehouse kérésben egy új további raktárat hozhatsz létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Warehouses>
	<Warehouse>
		<Action>add</Action>
		<Active>yes</Active>
		<Name><![CDATA[Beszállítói raktár]]></Name>
		<PublicName><![CDATA[Beszállítói raktár]]></PublicName>
		<Order>4</Order>
		<Type>external</Type>
		<SyncMainStockDisabled>no</SyncMainStockDisabled>
		<VisibleOnProductDetails>yes</VisibleOnProductDetails>
	</Warehouse>
</Warehouses>	


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Warehouses>
	<Warehouse>
		<Id>4590231</Id>
		<Status>ok</Status>
	</Warehouse>
</Warehouses>


További raktár törlése
Az alábbi setWarehouse kérés egy raktárat töröl az áruházból.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Warehouses>
	<Warehouse>
	    <Id>4590231</Id>
		<Action>delete</Action>
	</Warehouse>
</Warehouses>	


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<Warehouses>
	<Warehouse>
		<Id>4590231</Id>
		<Status>ok</Status>
	</Warehouse>
</Warehouses>
Megrendelés típusok
A webáruházban a megrendelések különböző típusúak lehetnek. A beállítható típusokat ezekkel a végpontokkal lehet létrehozni, módosítani, törölni.
Nem összekeverendő a megrendelés státuszokkal, melyek API dokumentációja itt érhető el!
Egy konkrét megrendelés típusát lekérdezni és módosítani a getOrder és setOrder végpont segítségével lehet!
getOrderType
A getOrderType végponttal listázhatók az áruházban megtalálható megrendelés típusok, a kérésben meghatározott feltételeknek megfelelően.
Végpont: https://api.unas.eu/shop/getOrderType
A getOrderType kérésben láthatod, hogy milyen módon lehet az megrendelés típusokat lekérdezni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setOrderType
A setOrderType végpont segítségével tudod a megrendelés típusokat létrehozni, módosítani illetve törölni a webáruházadból.
Végpont: https://api.unas.eu/shop/setOrderType
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setOrderType kérést, melynek válaszát a setOrderType válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getOrderType kérés
A getOrderType kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd a megrendelés típusokat listázni. A getOrderType kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz.
Id   integer
Az egyedi azonosítója alapján kérdezhetsz le egy típust.
getOrderType válasz
A getOrderType kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setOrderType kérés
A setOrderType kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setOrderType válasz
A setOrderType válaszban láthatod az információkat a módosított, létrehozott illetve törölt megrendelés típusokról. A válasz az alábbi mezőket tartalmazhatja.
Action   enum
Az API híváshoz tartozó műveletet írja le. Az alábbi műveletekről kapsz visszajelzést az API válaszban.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely vagy sikeres vagy sikertelen.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A megrendelés típusokat az alább látható adatszerkezet segítségével tudod kezelni. Az itt látható módon kell kérést intézni a szerverhez, ahol az egyes mezőkhöz külön található leírás arról, hogy melyik adattag használható a getOrderType illetve setOrderType végpontokhoz, GET illetve SET jelöléssel láttuk el ezeket a mezőket.
Speciális típusok
A speciális megrendelés típusok kapcsán ugyan lekérdezhetők az adatok, azonban módosítani csak a sorrendet lehet a SET végponton keresztül.
Speciális típusok, melyeket az Unas rendszer automatikusan hoz létre egy-egy funkció bekapcsolása esetén (pl. visszáru kezelés, piacterekhez kapcsolódó típusok stb.).
Action   enum SET
A setOrderType kérésben az API műveletet határozhatod meg.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A megrendelés típus egyedi azonosítója. SET végpontnál csak azonosító adatként használható, nem módosítható.
Name   string GET SET
Az megrendelés típus neve. Két ugyanolyan nevű típust nem lehet létrehozni.
Default   enum GET SET
A megrendelés típus alapértelmezett-e vagy sem az áruházban.
Order   int GET SET
A megrendelés típus sorrendjét lehet kezelni vele.
Creation   string GET
Megrendelés típus létrehozásának időpontja.
Modification   string GET
Megrendelés típus utolsó módosításának időpontja.
Példák
Megrendelés típus lekérdezése
Az alábbi getOrderType kérés egy konkrét megrendelés típus adatait kérdezi le ID alapján.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>12345</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<OrderTypes>
	<OrderType>
		<Id>12345</Id>
		<Name><![CDATA[Webáruházi rendelés]]></Name>
		<Default>yes</Default>
		<Order>1</Order>
		<Creation>2022.010.01 12:00:00</Creation>
		<Modification>2022.03.05 14:00:00</Modification>
	</OrderType>
</OrderTypes>


Megrendelés típus létrehozása
Az alábbi setOrderType kérés létrehoz egy megrendelés típust a megadott értékekkel, paraméterekkel.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<OrderTypes>
	<OrderType>
		<Name><![CDATA[Offline rendelés]]></Name>
		<Default>no</Default>
		<Order>5</Order>
	</OrderType>
</OrderTypes>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<OrderTypes>
	<OrderType>
		<Action>add</Action>
		<Id>67890</Id>
		<Status>ok</Status>
	</OrderType>
</OrderTypes>


Megrendelés típus törlése
Az alábbi példakódban egy megrendelés típus törlését láthatod.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<OrderTypes>
	<OrderType>
	    <Action>delete</Action>
		<Id>67890</Id>
	</OrderType>
</OrderTypes>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<OrderTypes>
	<OrderType>
		<Action>delete</Action>
		<Id>67890</Id>
		<Status>ok</Status>
	</OrderType>
</OrderTypes>
Átvételi pont csoportok
Az áruházban található szállítási módokhoz tartozhatnak bizonyos esetekben szállítási pontok, melyeket csoportokba sorolunk. Logikailag külön egységet jelentenek a webáruházban ezek a csoportok, így az API-n keresztül is külön lehet kezelni őket. Így a getDeliveryPointGroup végponttal tudsz átvételi pont csoportokat lekérdezni, míg a setDeliveryPointGroup használatával lehet létrehozni vagy módosítani pontcsoportot a webáruházban.
getDeliveryPointGroup
Az alábbi végpont visszaadja a kérésében meghatározott feltételeknek megfelelő átvételi pont csoportokat.
Végpont: https://api.unas.eu/shop/getDeliveryPointGroup
A getDeliveryPointGroup kérésben láthatod, hogy milyen módon lehet a csoportokat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy átvételi pont lekérdezése esetén:
PREMIUM 500 hívás / óra
VIP 1500 hívás / óra
Hívásonként több átvételi lekérdezése esetén:
PREMIUM 5 hívás / óra
VIP 15 hívás / óra
setDeliveryPointGroup
A setDeliveryPointGroup végpont segítségével átvételi pontokat tudsz a webáruházadban létrehozni, módosítani illetve törölni.
Végpont: https://api.unas.eu/shop/setDeliveryPointGroup
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setDeliveryPoint kérést, melynek a válaszát a setDeliveryPoint válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 átvételi pontot tartalmazó hívások esetén:
PREMIUM 500 hívás / óra
VIP 1500 hívás / óra
Több, mint 100 átvételi pontot tartalmazó hívások esetén esetén:
PREMIUM 5 hívás / óra
VIP 10 hívás / óra
getDeliveryPointGroup kérés
getDeliveryPointGroup kérésben határozhatod meg, milyen feltételek alapján szeretnéd az átvételi pontokat lekérni. A getDeliveryPointGroup kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz. A kérésben szereplő feltételek kombinálhatók.
Id   integer string
Átvételi pont csoport azonosítója.
Name   string
Átvételi pont csoport neve.
Type   enum
Átvételi pont csoport típusa. Ezzel a paraméterrel szűrhető, hogy saját vagy külső féltől származó átvételi pont csoportok jelenjenek meg a GET válaszban.
Használható értékek
own Saját átvételi pontok
thirdparty Külső féltől származó átvételi pontok
getDeliveryPointGroup válasz
A getDeliveryPointGroup kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setDeliveryPointGroup kérés
A setDeliveryPointGroup kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setDeliveryPointGroup válasz
A setDeliveryPointGroup válaszban láthatod az információkat a módosított, létrehozott illetve törölt átvételi pont csoportokról. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, melyek az alábbiak lehetnek.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Egyedi azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
Az átvételi pont csoportok kezeléshez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getDeliveryPointGroup kérésre a választ, illetve ilyen formában kell beküldened a setDeliveryPointGroup kérést. Az egyes mezőkhöz külön található leírás is, továbbá feltüntetjük azt, hogy melyik adattag használható a getDeliveryPointGroup illetve setDeliveryPointGroup végpontokhoz a GET illetve SET jelölések mentén.
Fontos megjegyeznünk, hogy a SET végponttal csak saját átvételi pont csoportokat lehet módosítani, a GET végponttal pedig minden típust le lehet kérdezni.
Action   enum SET
A műveletet leíró mező.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   string GET SET
Az átvételi pont csoport azonosítója.
Name   string GET SET
Az átvételi pont csoport neve.
Type   enum GET SET
Az átvételi pont csoport típusa.
Használható értékek
own Saját átvételi pont
MethodOfSelection   enum GET SET
A vásárló felületen az átvételi pont kiválasztási módja.
Használható értékek
multi Több legördülő menüből választható ki az átvételi pont (külön választható a város, utca).
single Egy legördülő menüből választható ki az átvételi pont.
Példák
Átvételi pont csoportok lekérdezése típus alapján
Az alábbi getDeliveryPointGroup kérésben a thirdparty típusú átvételi pont csoportokat kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Type>thirdparty</Type>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>pickpack</Id>
		<Name><![CDATA[Pick Pack Pontok]]></Name>
		<Type>thirdparty</Type>
		<MethodOfSelection>multi</MethodOfSelection>
	</DeliveryPointGroup>
	<DeliveryPointGroup>
		<Id>postapont</Id>
		<Name><![CDATA[Posta Pontok (posták + MOL kutak és COOP üzletek + csomagautomaták)]]></Name>
		<Type>thirdparty</Type>
		<MethodOfSelection>multi</MethodOfSelection>
	</DeliveryPointGroup>	
</DeliveryPointGroups>


Átvételi pont csoport lekérdezése egyedi azonosító alapján
Az alábbi getDeliveryPointGroup kérésben a pickpack azonosítójú átvételi pont csoportot kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Id>pickpack</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>pickpack</Id>
		<Name><![CDATA[Pick Pack Pontok]]></Name>
		<Type>thirdparty</Type>
		<MethodOfSelection>multi</MethodOfSelection>
	</DeliveryPointGroup>
</DeliveryPointGroups>


Átvételi pont csoport létrehozása
Az alábbi setDeliveryPointGroup kérésben egy saját átvételi pont csoportot hozhatsz létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>1234</Id>
		<Name><![CDATA[Saját átvételi pontok csoportja]]></Name>
		<Type>own</Type>
		<MethodOfSelection>multi</MethodOfSelection>
	</DeliveryPointGroup>
</DeliveryPointGroups>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>1234</Id>
		<Status>ok</Status>
	</DeliveryPointGroup>
</DeliveryPointGroups>


Átvételi pont csoport törlése
Az alábbi setDeliveryPointGroup kérésben egy saját átvételi pont csoportot törölhetsz.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>1234</Id>
		<Action>delete</Action>
	</DeliveryPointGroup>
</DeliveryPointGroups>	


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>1234</Id>
		<Status>ok</Status>
	</DeliveryPointGroup>
</DeliveryPointGroups>
Átvételi pontok
Az átvételi pont csoportok létrehozása illetve kezelése önmagában nem elegendő. Szükség van az áruházban ezen csoportok alá átvételi pontokat létrehozni, módosítani és esetleg törölni, hogy a vásárlóid mindig az aktuális átvételi pontok közül tudjanak választani a megrendelési folyamat során.
getDeliveryPoint
Az alábbi végpont visszaadja a kérésében meghatározott feltételeknek megfelelő átvételi pontokat.
Végpont: https://api.unas.eu/shop/getDeliveryPoint
A getDeliveryPoint kérésben láthatod, hogy milyen módon lehet a átvételi pontokat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy átvételi pont lekérdezése esetén:
PREMIUM 500 hívás / óra
VIP 1500 hívás / óra
Hívásonként több átvételi lekérdezése esetén:
PREMIUM 5 hívás / óra
VIP 15 hívás / óra
setDeliveryPoint
A setDeliveryPoint végpont segítségével átvételi pontokat tudsz a webáruházadban létrehozni, módosítani illetve törölni.
Végpont: https://api.unas.eu/shop/setDeliveryPoint
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setDeliveryPoint kérést, melynek a válaszát a setDeliveryPoint válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 átvételi pontot tartalmazó hívások esetén:
PREMIUM 500 hívás / óra
VIP 1500 hívás / óra
Több, mint 100 átvételi pontot tartalmazó hívások esetén esetén:
PREMIUM 5 hívás / óra
VIP 10 hívás / óra
getDeliveryPoint kérés
getDeliveryPoint kérésben határozhatod meg, milyen feltételek alapján szeretnéd az átvételi pontokat lekérni. A getDeliveryPoint kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz.
DeliveryPointGroup   integer string
Átvételi pont csoport azonosítója. Az ebbe a csoportba tartozó átvételi pontok szerepelnek majd a getDeliveryPoint válaszban.
getDeliveryPoint válasz
A getDeliveryPoint kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setDeliveryPoint kérés
A setDeliveryPoint kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setDeliveryPoint válasz
A setDeliveryPoint válaszban láthatod az információkat a módosított, létrehozott illetve törölt átvételi pontokról. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbiak egyike lehet.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Átvételi pont azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
Az átvételi pontok kezeléshez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getDeliveryPoint kérésre a választ, illetve ilyen formában kell beküldened a setDeliveryPoint kérést. Az egyes mezőkhöz külön található leírás is. Feltüntetjük, hogy melyik adattag használható a getDeliveryPoint illetve setDeliveryPoint végpontokhoz a GET illetve SET jelölések mentén.
Fontos megjegyeznünk, hogy a SET végponttal csak saját átvételi pontokat lehet módosítani, a GET végponttal pedig minden típust le lehet kérdezni.
Action   enum SET
A műveletet leíró mező.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   string GET SET
Az átvételi pont azonosítója.
Name   string GET SET
Az átvételi pont neve.
Country   string GET SET
Az átvételi ponthoz tartozó ország.
County   string GET SET
Az átvételi ponthoz tartozó megye.
City   string GET SET
Az átvételi ponthoz tartozó város.
Zip   string GET SET
Az átvételi ponthoz tartozó irányítószám.
District   string GET SET
Az átvételi ponthoz tartozó településrész.
Street   string GET SET
Az átvételi ponthoz tartozó utca.
Info   string GET SET
Az átvételi ponthoz tartozó egyéb információk (pl. nyitvatartás stb.).
Példák
Átvételi pontok lekérdezése átvételi pont csoport alapján
Az alábbi getDeliveryPoint kérésben a pickpack nevű csoporthoz tartozó átvételi pontokat kérheted le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <DeliveryPointGroup>pickpack</DeliveryPointGroup>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPoints>
	<DeliveryPoint>
		<Id>102847</Id>
		<Name><![CDATA[OMV-Széchenyi tér#HD115#]]></Name>
		<Country>hu</Country>
		<County>Budapest</County>
		<City>Budapest</City>
		<Zip>1152</Zip>
		<District>XV.</District>
		<Street>Széchenyi tér 1.</Street>
		<Info><![CDATA[<em>Bankkártyás fizetés:</em> Van
              <em>Nyitvatartás:</em>
              &nbsp;&nbsp;&nbsp;&nbsp;Hétfő: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Kedd: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Szerda: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Csütörtök: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Péntek: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Szombat: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Vasárnap: 00:00-23:59]]>
        </Info>
	</DeliveryPoint>
	<DeliveryPoint>
		<Id>103373</Id>
		<Name><![CDATA[OMV-Könyves Kálmán krt 76.#HD108#]]></Name>
		<Country>hu</Country>
		<County>Budapest</County>
		<City>Budapest</City>
		<Zip>1087</Zip>
		<District>VIII.</District>
		<Street>Könyves K. krt 76</Street>
		<Info><![CDATA[<em>Bankkártyás fizetés:</em> Van
              <em>Nyitvatartás:</em>
              &nbsp;&nbsp;&nbsp;&nbsp;Hétfő: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Kedd: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Szerda: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Csütörtök: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Péntek: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Szombat: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Vasárnap: 00:00-23:59]]>
        </Info>
	</DeliveryPoint>
	...
</DeliveryPoints>


Átvételi pont lekérdezése egyedi azonosító alapján
Az alábbi getDeliveryPoint kérésben a 102847 egyedi azonosítójú átvételi pontot kérheted le. Fontos, hogy az átvételi pont csoport azonosító is kell a getDeliveryPoint kérésbe.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
    <Id>102847</Id>
    <DeliveryPointGroup>pickpack</DeliveryPointGroup>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPoints>
	<DeliveryPoint>
		<Id>102847</Id>
		<Name><![CDATA[OMV-Széchenyi tér#HD115#]]></Name>
		<Country>hu</Country>
		<County>Budapest</County>
		<City>Budapest</City>
		<Zip>1152</Zip>
		<District>XV.</District>
		<Street>Széchenyi tér 1.</Street>
		<Info><![CDATA[<em>Bankkártyás fizetés:</em> Van
              <em>Nyitvatartás:</em>
              &nbsp;&nbsp;&nbsp;&nbsp;Hétfő: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Kedd: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Szerda: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Csütörtök: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Péntek: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Szombat: 00:00-23:59
              &nbsp;&nbsp;&nbsp;&nbsp;Vasárnap: 00:00-23:59]]>
        </Info>
	</DeliveryPoint>
</DeliveryPoints>


Saját átvételi pont létrehozása
Az alábbi setDeliveryPoint kérésben egy saját átvételi pontot hozhatsz létre. A DeliveryPointGroup mező kötelező a kérésben.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPoints>
	<DeliveryPoint>
		<Id>123456</Id>
		<DeliveryPointGroup>3456</DeliveryPointGroup>
		<Name><![CDATA[Saját átvételi pont neve]]></Name>
		<Country>hu</Country>
		<County>Győr-Moson-Sopron</County>
		<City>Sopron</City>
		<Zip>9400</Zip>
		<Street>Kőszegi út 14.</Street>
		<Info><![CDATA[Információk az átvételi pontomról]]></Info>
	</DeliveryPoint>
</DeliveryPoints>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPoints>
	<DeliveryPoint>
		<Id>123456</Id>
		<Status>ok</Status>
	</DeliveryPoint>
</DeliveryPoints>


Saját átvételi pont törlése
Az alábbi setDeliveryPoint kérésben egy új saját átvételi pontot törölhetsz.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPointGroups>
	<DeliveryPointGroup>
		<Id>own-id-123456</Id>
		<Action>delete</Action>
	</DeliveryPointGroup>
</DeliveryPointGroups>	


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<DeliveryPoints>
	<DeliveryPoints>
		<Id>own-id-123456</Id>
		<Status>ok</Status>
	</DeliveryPoint>
</DeliveryPoints>
Csomagajánlatok
A webáruházban szereplő csomagajánlatok lekérdezéséhez, létrehozásához, módosításához, törléséhez tartozó API végpontok.
getPackageOffer
Az alábbi végpont visszaadja a kérésben meghatározott feltételeknek megfelelő csomagajánlatokat.
Végpont: https://api.unas.eu/shop/getPackageOffer
A getPackageOffer kérésben láthatod, hogy milyen módon lehet a csomagajánlatokat listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy csomagajánlat lekérdezése esetén:
PREMIUM 500 hívás / óra
VIP 1500 hívás / óra
Hívásonként több csomagajánlat lekérdezése esetén:
PREMIUM 5 hívás / óra
VIP 15 hívás / óra
setPackageOffer
A setPackageOffer végpont segítségével csomagajánlatokat tudsz a webáruházadban létrehozni, módosítani illetve törölni.
Végpont: https://api.unas.eu/shop/setPackageOffer
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setPackageOffer kérést, melynek a válaszát a setPackageOffer válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 csomagajánlatot tartalmazó hívások esetén:
PREMIUM 500 hívás / óra
VIP 1500 hívás / óra
Több, mint 100 csomagajánlatot tartalmazó hívások esetén esetén:
PREMIUM 5 hívás / óra
VIP 10 hívás / óra
getPackageOffer kérés
getPackageOffer kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd az csomagajánlatokat lekérni. A getPackageOffer kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz.
Id   integer
Azonosító alapján le tudsz kérni egy vagy több csomagajánlatot. Ha többet szeretnél lekérdezni, akkor vesszővel elválasztva sorold fel az azonosítókat.
Active   enum
Az aktív vagy inaktív csomagajánlatokat tudod lekérni ennek segítségével.
Name   string
Konkrét név alapján kérhetsz le egy csomagajánlatot.
Lang   string
Lekérdezhetőek a csomagajánlat fordításai is. Ha nincs lefordítva az ajánlathoz tartozó szöveges tartalom, akkor a webáruház alapnyelvén jelenik meg az ajánlat a válaszban. Ezen attribútum használatával csak a szöveges tartalmak jelennek meg a válaszban!
getPackageOffer válasz
A getPackageOffer kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setPackageOffer kérés
A setPackageOffer kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setPackageOffer válasz
A setPackageOffer válaszban láthatod az információkat a módosított, létrehozott illetve törölt csomagajánlatokról. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbiak egyike lehet.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Csomagajánlat azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A csomagajánlatok kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getPackageOffer kérésre a választ, illetve ilyen formában kell beküldened a setPackageOffer kérést. Az egyes mezőkhöz külön található leírás is, továbbá feltüntetjük azt is, hogy melyik adattag használható a getPackageOffer illetve setPackageOffer végpontokhoz a GET illetve SET jelölések mentén.
Action   enum SET
A műveletet leíró mező.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A csomagajánlat azonosítója.
Name   string GET SET
Az csomagajánlat neve.
Order   integer GET SET
Az csomagajánlat sorrend értéke. Az áruházban az itt megadott értékek mentén kerülnek kiértékelésre az ajánlatok, ebben a sorrendben jelennek meg a vásárlók számára a választható értékek.
Active   enum GET SET
Ezzel a beállítással vezérelhető, hogy megjelenjen-e a csomagajánlat vagy sem.
Használható értékek
yes no
DiscountType   enum GET SET
A csomagajánlat kedvezmény típusa.
Használható értékek
price_amount - Normál árból összegszerű kedvezmény
sale_price_amount - Kedvezményes árból összegszerű kedvezmény
price_percent - Normál árból százalékos kedvezmény
sale_price_percent - Kedvezményes árból százalékos kedvezmény
fix_price - Fix ár
Start   date GET SET
A csomagajánlat érvényességének kezdeti időpontja, várt formátum: YYYY.MM.DD.
End   date GET SET
A csomagajánlat érvényességének befejező időpontja, várt formátum: YYYY.MM.DD.
Items   object GET SET
A csomagajánlat tételeket leíró XML node. Csomagajánlat létrehozása esetén kötelező adat.
Items.Item   object GET SET
Egy csomagajánlat tételt leíró XML node.
Items.Item.Id   integer GET SET
A csomagajánlat tétel azonosítója. Létrehozás során nem kell megadni.
Items.Item.Sku   string GET SET
A csomagajánlat tételben szereplő termék cikkszáma.
Items.Item.Quantity   float GET SET
A csomagajánlat tételben szereplő termék mennyisége.
Items.Item.Discount   float GET SET
A csomagajánlat tételben szereplő termék kedvezmény vagy fix ár.
Példák
Csomagajánlat lekérése azonosító alapján
Az alábbi getPackageOffer kérésben a 640 azonosítójú csomagajánlatot kérdezzük le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>640</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PackageOffers>
	<PackageOffer>
		<Id>640</Id>
		<Name><![CDATA[Csomag ajánlat #1]]></Name>
		<Order>1</Order>
		<Active>yes</Active>
		<DiscountType>sale_price_percent</DiscountType>
		<Start>2024.04.01</Start>
		<End>2024.04.30</End>
		<Items>
			<Item>
				<Id>2250</Id>
				<Sku>product_1</Sku>
				<Quantity>1</Quantity>
				<Discount>15</Discount>
			</Item>
			<Item>
				<Id>2255</Id>
				<Sku>product_3</Sku>
				<Quantity>1</Quantity>
				<Discount>10</Discount>
			</Item>
			<Item>
				<Id>2260</Id>
				<Sku>product_4</Sku>
				<Quantity>1</Quantity>
				<Discount>50</Discount>
			</Item>
		</Items>
	</PackageOffer>
</PackageOffers>


Több csomagajánlat lekérdezése
Az alábbi getPackageOffer kérésben a 640 és a 645 egyedi csomagajánlatot kérjük le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>640,645</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PackageOffers>
	<PackageOffer>
		<Id>640</Id>
		<Name><![CDATA[Csomag ajánlat #1]]></Name>
		<Order>1</Order>
		<Active>yes</Active>
		<DiscountType>sale_price_percent</DiscountType>
		<Start>2024.04.01</Start>
		<End>2024.04.30</End>
		<Items>
			<Item>
				<Id>2250</Id>
				<Sku>product_1</Sku>
				<Quantity>1</Quantity>
				<Discount>15</Discount>
			</Item>
			<Item>
				<Id>2255</Id>
				<Sku>product_3</Sku>
				<Quantity>1</Quantity>
				<Discount>10</Discount>
			</Item>
			<Item>
				<Id>2260</Id>
				<Sku>product_4</Sku>
				<Quantity>1</Quantity>
				<Discount>50</Discount>
			</Item>
		</Items>
	</PackageOffer>
	<PackageOffer>
		<Id>645</Id>
		<Name><![CDATA[Csomag ajánlat #2]]></Name>
		<Order>2</Order>
		<Active>yes</Active>
		<DiscountType>price_amount</DiscountType>
		<Items>
			<Item>
				<Id>2265</Id>
				<Sku>product_4</Sku>
				<Quantity>1</Quantity>
				<Discount>1000</Discount>
			</Item>
			<Item>
				<Id>2270</Id>
				<Sku>product_2</Sku>
				<Quantity>1</Quantity>
				<Discount>1000</Discount>
			</Item>
			<Item>
				<Id>2275</Id>
				<Sku>product_5</Sku>
				<Quantity>1</Quantity>
				<Discount>2000</Discount>
			</Item>
			<Item>
				<Id>2686</Id>
				<Sku>product_1</Sku>
				<Quantity>1</Quantity>
				<Discount>2500</Discount>
			</Item>
		</Items>
	</PackageOffer>
</PackageOffers>


Csomagajánlat létrehozása
Az alábbi setPackageOffer kérésben egy csomagajánlatot hozunk létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PackageOffers>
	<PackageOffer>
		<Action>add</Action>
		<Name><![CDATA[Ajánlat 1]]></Name>
		<Order>1</Order>
		<Active>yes</Active>
		<DiscountType>price_percent</DiscountType>		
		<Items>
			<Item>
				<Sku>product_1</Sku>
				<Quantity>1</Quantity>
				<Discount>15</Discount>
			</Item>
			<Item>
				<Sku>product_3</Sku>
				<Quantity>1</Quantity>
				<Discount>10</Discount>
			</Item>
			<Item>
				<Sku>product_4</Sku>
				<Quantity>1</Quantity>
				<Discount>50</Discount>
			</Item>
		</Items>
	</PackageOffer>
</PackageOffers>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PackageOffers>
	<PackageOffer>
		<Action>add</Action>
		<Id>690</Id>
		<Status>ok</Status>
	</PackageOffer>
</PackageOffers>


Csomag ajánlat törlése
Az alábbi setPackageOffer kérésben egy csomagajánlat kerül törlésre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<PackageOffers>
	<PackageOffer>
	    <Id>690</Id>
		<Action>delete</Action>
	</PackageOffer>
</PackageOffers>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<PackageOffers>
	<PackageOffer>
		<Action>delete</Action>
		<Id>690</Id>
		<Status>ok</Status>
	</PackageOffer>
</PackageOffers>
Termék vélemények
A webáruházban szereplő termék vélemények lekérdezéséhez, létrehozásához, módosításához, törléséhez tartozó API végpontok.
getProductReview
Az alábbi végpont visszaadja a kérésben meghatározott feltételeknek megfelelő termék véleményeket.
Végpont: https://api.unas.eu/shop/getProductReview
A getProductReview kérésben láthatod, hogy milyen módon lehet a termék véleményeket listázni, amire az adatszerkezetnek megfelelő választ kapod. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Hívásonként egy termék vélemény lekérdezése esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Hívásonként több termék vélemény lekérdezése esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
setProductReview
A setProductReview végpont segítségével termék véleményeket tudsz a webáruházadban létrehozni, módosítani illetve törölni.
Végpont: https://api.unas.eu/shop/setProductReview
Az adatszerkezet fejezetben láthatod, hogy milyen módon lehet összeállítani a setProductReview kérést, melynek a válaszát a setProductReview válasz fejezetben találod meg. A Limitációk pontban leírtakon felül ennél a végpontnál az alábbi limitek élnek:
Maximum 100 termék véleményt tartalmazó hívások esetén:
PREMIUM 1000 hívás / óra
VIP 3000 hívás / óra
Több, mint 100 termék véleményt tartalmazó hívások esetén esetén:
PREMIUM 30 hívás / óra
VIP 90 hívás / óra
getProductReview kérés
getProductReview kérésben határozhatod meg, hogy milyen feltételek alapján szeretnéd a termék véleményeket lekérni. A getProductReview kérés válasz formátumáról az adatszerkezet fejezetben olvashatsz.
Id   integer
Azonosító alapján le tudsz kérni egy termék véleményt.
Sku   string
Termék cikkszám alapján lehet lekérni egy vagy több véleményt.
Lang   string
Nyelv alapján kérdezhetőek le a termék vélemények.
Confirm   string
Ellenőrzött vagy nem ellenőrzött vélemények kérhetőek le.
Használható értékek
0 1
getProductReview válasz
A getProductReview kérésre kapott válasz adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setProductReview kérés
A setProductReview kérés adatainak és azok strukturális felépítésének leírása a kapcsolódó Adatszerkezet menüpontban található.
setProductReview válasz
A setProductReview válaszban láthatod az információkat a módosított, létrehozott illetve törölt termék véleményekről. A válaszban található mezőkről bővebb információt az alábbi fejezetben olvashatsz.
Action   enum
Az API híváshoz tartozó műveletet írja le ez a mező, mely az alábbiak egyike lehet.
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer
Termék vélemény azonosító.
Status   enum
Az API hívás státusza, mely sikeres vagy sikertelen lehet.
ok error
Error   string
Hibás API hívás esetén a hiba leírása.
Adatszerkezet
A termék vélemények kezeléséhez az ebben a fejezetben megtalálható adatszerkezetnek megfelelően kapod a getProductReview kérésre a választ, illetve ilyen formában kell beküldened a setProductReview kérést. Az egyes mezőkhöz külön található leírás is, továbbá feltüntetjük azt is, hogy melyik adattag használható a getProductReview illetve setProductReview végpontokhoz a GET illetve SET jelölések mentén.
Action   enum SET
A műveletet leíró mező.
Használható értékek
add Hozzáadás
modify Módosítás
delete Törlés
Id   integer GET SET
A termék vélemény azonosítója.
Lang   string GET SET
A termék vélemény nyelve. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során csak azonosító adatként használható, nem módosítható.
Sku   string GET SET
A termék cikkszáma, melyhez a vélemény tartozik. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Score   int GET SET
A termék vélemény értéke. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Használható értékek
1 2 3 4 5
Name   string GET SET
A termék véleményt író neve. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Email   string GET SET
A termék véleményt író email címe. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Message   string GET SET
A termék vélemény szövege. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Pros   string GET SET
A termék véleményhez tartozó, külön feltüntetett előnyök. SET végpontnál, új vélemény létrehozása esetén megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Cons   string GET SET
A termék véleményhez tartozó, külön feltüntetett hátrányok. SET végpontnál, új vélemény létrehozása esetén megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Images   object GET
A termék véleményhez tartozó képek elérési útvonala (URL).
Images.ImageUrl   string GET
A konkrét képhez tartozó elérési útvonal (URL).
Date   string GET SET
A termék vélemény rögzítésének ideje. SET végpontnál, új vélemény létrehozása esetén kötelezően megadható elem, míg meglévő vélemény módosítása során nem módosítható.
Active   string GET SET
A termék vélemény állapota (megjelenik-e a vásárló felületen vagy sem).
Használható értékek
yes no
Confirmed   string GET SET
A termék vélemény jóváhagyott állapota.
Használható értékek
yes no
VerifiedCustomer   string GET SET
A termék véleményt igazolt vásárló írta-e vagy sem.
Használható értékek
yes no
Answer   string GET SET
A termék véleményre adott adminisztrátori válasz.
Respondent   string GET SET
A termék véleményre adott adminisztrátori választ író neve.
Példák
Termék vélemény lekérése azonosító alapján
Az alábbi getProductReview kérésben a 689247 azonosítójú véleményt kérdezzük le.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<Params>
	<Id>689247</Id>
</Params>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ProductReviews>
	<ProductReview>
		<Id>689247</Id>
		<Lang>hu</Lang>
		<Sku>ABC123</Sku>
		<Score>4</Score>
		<Name><![CDATA[Kiss Géza]]></Name>
		<Email>unas@unas.hu</Email>
		<Message><![CDATA[Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.]]></Message>
		<Pros><![CDATA[Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.]]></Pros>
		<Cons><![CDATA[Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.]]></Cons>
		<Images>
		    <ImageUrl><![CDATA[https://shop.unas.hu/pic/review_image1.jpg]]></ImageUrl>
		    <ImageUrl><![CDATA[https://shop.unas.hu/pic/review_image2.jpg]]></ImageUrl>
		    <ImageUrl><![CDATA[https://shop.unas.hu/pic/review_image3.jpg]]></ImageUrl>
		</Images>
		<Date>2025.06.01 12:00:00</Date>
		<Active>yes</Active>
		<Confirmed>no</Confirmed>
		<VerifiedCustomer>yes</VerifiedCustomer>
		<Answer><![CDATA[Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.]]></Answer>
		<Respondent><![CDATA[Adminisztrátor]]></Respondent>
	</ProductReview>
</ProductReviews>


Termék vélemény létrehozása
Az alábbi setProductReview kérésben egy termék véleményt hozunk létre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<ProductReviews>
	<ProductReview>
		<Action>add</Action>
		<Lang>hu</Lang>
		<Sku>ABC123</Sku>
		<Score>5</Score>
		<Name><![CDATA[Nagy Béláné]]></Name>
		<Email>unas@unas.hu</Email>
		<Message><![CDATA[Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.]]></Message>
		<Date>2025.06.10 20:00:00</Date>
		<Active>yes</Active>
		<Confirmed>no</Confirmed>
		<VerifiedCustomer>yes</VerifiedCustomer>
	</ProductReview>
</ProductReviews>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ProductReviews>
	<ProductReview>
		<Action>add</Action>
		<Id>689248</Id>
		<Status>ok</Status>
	</ProductReview>
</ProductReviews>


Termék vélemény törlése
Az alábbi setProductReview kérésben egy termék vélemény kerül törlésre.
Kérés
<?xml version="1.0" encoding="UTF-8" ?>
<ProductReviews>
	<ProductReview>
	    <Id>689249</Id>
		<Action>delete</Action>
	</ProductReview>
</ProductReviews>


Válasz
<?xml version="1.0" encoding="UTF-8" ?>
<ProductReviews>
	<ProductReview>
		<Action>delete</Action>
		<Id>689249</Id>
		<Status>ok</Status>
	</ProductReview>
</ProductReviews>

