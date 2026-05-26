# My Understanding

## Submission Links

**Loom Video (must be set to public — anyone with the link):**
[paste your Loom video URL here]

https://www.loom.com/share/0faff5cb9ea345a69d46efe5bc1adf8e

https://www.loom.com/share/d929fb1da22f4f28bd851b26ebd72ea0

https://www.loom.com/share/8ee7fb4bdc7a4abb8247d98771c7fd88

## Questions

Answer each question in your own words. There are no trick questions.

The goal is not a perfect answer — it is an honest one. Write as if you are explaining to a friend who has never used Express. Completing this will prepare you for your video walkthrough.

Do not copy from documentation, your code comments, or AI output. If you are unsure about something, write what you do understand and note where the gap is.

---

**1. What does each HTTP method in your API mean — GET, POST, PUT or PATCH, and DELETE? Why do we use different methods instead of just using POST for everything?**

GET: คือการดึงข้อมูลจากเซิร์ฟเวอร์ออกมาดู โดยไม่มีการแก้ไขข้อมูล

POST: คือการเพิ่มข้อมูลใหม่เข้าไปให้เซิร์ฟเวอร์บันทึก

PUT: คือการแก้ไขข้อมูลแบบยกชุดหรือเปลี่ยนใหม่ทั้งหมด

PATCH: คือการแก้ไขข้อมูลเฉพาะบางจุด โดยที่ข้อมูลส่วนอื่นจะยังคงเหมือนเดิม

DELETE: คือการลบข้อมูลออกจากระบบ

ถ้าเราใช้ POST กับทุกอย่าง เราจะไม่รู้ว่าเส้นทางนี้กำลังจะลบ แก้ไข หรือดึงข้อมูลมาดูเฉยๆ แล้วยังมีปัญหาเกี่ยวกับความปลอดภัยและการทำแคชชิ่งของบราวเซอร์จะจัดการได้ยากมากๆ

**2. What is `express.json()` and what would happen if you left it out?**

มันคือล่ามแปลภาษาที่มากับ Express โดยปกติข้อมูลที่เข้ามาในเซิร์ฟเวอร์ จะมาในรูปแบบของ JSON String
ซึ่งเซิร์ฟเวอร์ Express จะอ่านไม่ออก express.json() จะทำหน้าที่แปลผลให้กลายเป็น JavaScript Object แล้วนำไปผูกไว้กับตัวแปรที่ชื่อว่า req.body เพื่อให้เราหยิบไปใช้ต่อได้

ถ้าลบออก: ตัวแปร req.body ใน Route POST, PUT, และ PATCH ทั้งหมดจะกลายเป็น undefined (ค่าว่าง) ทันที ส่งผลให้ระบบไม่สามารถรับรู้ข้อมูลที่ส่งมาได้ โค้ดส่วนที่เช็ก Validation ก็จะตีกลับว่าไม่มีข้อมูล และทำให้ระบบพัง

**3. What is the difference between `req.body`, `req.params`, and `req.query`? Give a real example from your API for each one.**

req.body: ใช้ส่งข้อมูลที่มีขนาดใหญ่หรือมีโครงสร้างซับซ้อน โดยซ่อนมากับส่วนเนื้อหาของ Request (Body) ไม่โชว์บน URL มักใช้กับการสร้างหรือแก้ไขข้อมูล

ตัวอย่างใน API: ใช้ใน POST /products เพื่อรับข้อมูลสินค้าใหม่ เช่น {"name": "Power Bank", "price": 590}

req.params: คือข้อมูลที่ฝังอยู่กับตัวเส้นทาง URL เลย (Route Parameters) สังเกตจากเครื่องหมาย : ในโค้ด มักใช้เจาะจงทรัพยากรชิ้นใดชิ้นหนึ่งด้วย ID

ตัวอย่างใน API: ใช้ใน GET /products/:id เช่น ถ้า URL มาเป็น /products/123 ตัว req.params.id ก็จะมีค่าเท่ากับ "123" เพื่อเอาไปค้นหาสินค้าชิ้นนั้นต่อ

req.query: คือข้อมูลตัวเลือกเพิ่มเติมที่อยู่ท้าย URL หลังเครื่องหมายคำถาม ? (Query String) มักใช้สำหรับการกรอง (Filter) ค้นหา (Search) หรือจัดเรียง (Sort) ข้อมูล

ตัวอย่างใน API: ใช้ใน GET /products?name=mouse&sort=price ซึ่งระบบจะแกะ req.query.name ออกมาเพื่อกรองหาสินค้าที่มีคำว่า mouse และแกะ req.query.sort มาเพื่อเรียงลำดับราคา

**4. What are HTTP status codes? List every status code you used in your API and explain why you chose it for that situation.**

HTTP Status Codes คือ "รหัสสถานะ" ที่เซิร์ฟเวอร์ส่งกลับไปบอก Client เพื่อรายงานผลว่าสิ่งที่ร้องขอมาทำสำเร็จหรือไม่ โดยใน API ของผมมีการเลือกใช้รหัสดังนี้ครับ:

200 OK: ใช้กับการทำงานที่สำเร็จทั่วไป เช่น ดึงข้อมูลสินค้าสำเร็จ (GET), แก้ไขข้อมูลสินค้าสำเร็จ (PUT/PATCH), หรือลบสินค้าสำเร็จ (DELETE)

201 Created: ใช้เจาะจงกับการสร้างข้อมูลใหม่สำเร็จ ใน Route POST /products และ POST /products/bulk เพื่อบอกหน้าบ้านว่าข้อมูลชิ้นใหม่ถูกบันทึกเข้าเซิร์ฟเวอร์เรียบร้อยแล้ว

400 Bad Request: ใช้เมื่อ Client ส่งข้อมูลมาไม่ถูกต้องตามเงื่อนไข (Validation Error) เช่น ลืมส่งชื่อสินค้า ส่งราคามาเป็นตัวอักษร หรือในกรณี POST /products/bulk ที่กำหนดว่าต้องส่งข้อมูลมาเป๊ะ ๆ 5 ชิ้นเท่านั้น

404 Not Found: ใช้เมื่อหาทรัพยากรที่ขอไม่เจอ เช่น Client ค้นหาหรือขอลบสินค้าด้วย ID ที่ไม่มีอยู่จริงใน Array รวมถึงกรณีที่ยิงเข้ามาใน URL เส้นทางที่ระบบไม่ได้เขียนรองรับไว้

500 Internal Server Error: รหัสเซิฟเวอร์พัง ใช้ใน Centralized Error Handler เพื่อตั้งค่าเผื่อไว้ในกรณีที่โค้ดภายในเกิดข้อผิดพลาดขั้นรุนแรงที่ไม่ได้คาดคิด ระบบจะส่งรหัสนี้กลับไปเพื่อไม่ให้แอปพลิเคชันฝั่งหน้าบ้านค้าง

**5. What is middleware? Describe what it does in your own words and give one example from your code.**

Middleware เป็นเหมือนผู้ช่วยที่อยู่ตรงกลางคอยตรวจตราอยู่ตามทางเดิน ก่อนที่ Request จะเดินทางไปถึงจุดหมายปลายทาง (Route Handler) ตัว Middleware สามารถเข้ามาอ่านข้อมูล แอบแก้ไขข้อมูล ตรวจสอบสิทธิ์ หรือสั่งยุติคำสั่งกลางคันแล้วไล่กลับบ้านได้ทันทีหากทำผิดกฎ

ผมเขียน Custom Request Logger Middleware เอาไว้ที่ช่วงต้นของโค้ด ทุกครั้งที่มี Request ยิงเข้ามา ด่านตรวจตัวนี้จะคอยจดบันทึกวันเวลา, HTTP Method และ URL ออกมาพิมพ์บนหน้าจอ Console ให้เราเห็น

**6. Why does the order of middleware matter in Express? What could go wrong if it were in the wrong order?**

เพราะ Express ทำงานแบบเรียงจากบนลงล่าง ข้อมูลจะวิ่งผ่าน Middleware ตามลำดับบรรทัดที่เราเขียนไว้ในโค้ดเลยครับ ลำดับจึงมีความสำคัญมาก สมมติว่าเราเอา Error Handling Middleware ที่ต้องอยู่ล่างสุด เอาไปไว้บนสุด มันจะไม่สามารถดักจับข้อผิดพลาดจาก Route ไหนได้เลย

**7. Walk through what happens on the server, step by step, when a POST request is sent to `/products`.**

express.json รับข้อความดิบ JSON Stringt ส่งมา แปลงเป็น JavaScript Object แล้วเอาไปผูกไว้กับตัวแปร req.body 

พอเจอ MiddlewareLogger มันจะจับเวลาและบันทึกข้อมูลการเข้าถึงลง Console ว่ามีคำสั่ง POST เข้ามาที่ /products 

มาถึง (Route Handler - POST): ข้อมูลวิ่งมาถึง Route ตรงตามเงื่อนไข:

ดึงข้อมูล name, price, quantity ออกมาจาก req.body

ส่งข้อมูลไปตรวจที่ฟังก์ชัน validateProductData

ถ้าข้อมูลไม่ผ่านจะเจอ Error โค้ดจะสร้าง new Error พร้อมสถานะ 400 แล้วสั่ง return next(error) เพื่อไปด่านสุดท้าย

ถ้าข้อมูลถูกต้องทั้งหมด: โค๊ดจะรวมข้อมูลให้เป็นสินค้าใหม่ gen ID แล้วจัดการ .push() เพิ่มเข้าไปในอาร์เรย์ products ในหน่วยความจำ

ถ้าถึงตรงนี้ เซิร์ฟเวอร์จะส่ง HTTP Status 201 Created พร้อมข้อมูลสินค้าที่เพิ่งสร้างกลับไปให้ Client ในรูปแบบ JSON

**8. What is CRUD? Map each operation to the HTTP method and route you used in your API.**

CRUD คือย่อมาจากคำสั่งพื้นฐาน 4 อย่างในการจัดการข้อมูลในระบบฐานข้อมูลหรือ API ครับ โดยใน API ของผมจับคู่ได้ดังนี้:

C - Create (สร้างข้อมูล): * ใช้ POST /products (สร้างสินค้าชิ้นเดียวแบบปกติ)

R - Read (อ่านข้อมูล): * ใช้ GET /products (ดึงรายการสินค้าทั้งหมด/กรองข้อมูลตามเงื่อนไข)

U - Update (แก้ไขข้อมูล): * ใช้ PUT /products/:id (แก้ไขหรือแทนที่ข้อมูลสินค้าตัวเดิมทั้งหมด)

ใช้ PATCH /products/:id (เลือกแก้ไขเฉพาะบางฟิลด์ข้อมูลที่ส่งมา)

D - Delete (ลบข้อมูล): * ใช้ DELETE /products/:id (ลบสินค้าออกจากระบบตาม ID)

**9. How does your API respond when something goes wrong — for example, when a product with a given ID does not exist?**

ผมใช้ระบบจัดการ Error จากส่วนกลาง ทำให้เวลาที่เกิดข้อผิดพลาด ระบบจะสร้าง Status error ขึ้นมา เช่น ถ้าใช้คำสั่งค้นหาแล้วไม่เจอสินค้า โค๊ดจะสร้าง error object "Product not found" พร้อมสถานะ 404

หลังจากนั้นจะเรียกคำสั่ง next(error) เพื่อส่งต่อปัญหานี้ ข้ามไปหา Middleware ตัวสุดท้ายของแอพ

ตัวดัก Error ด้านล่างสุดจะทำการแตกข้อมูล และส่ง Res กลับไปหา Client เช่น { "error": "Product not found" } พร้อม Status 404 ไปด้วย ทำให้หน้าบ้านรู้ว่าเกิดอะไรขึ้น และเซิร์ฟเวอร์ก็ไม่พัง

**10. What was the hardest part of building this API and what did you do to get past it?**

ผมไม่รู้จะเอาโค๊ดไหนวางก่อน วางหลัง เพราะรู้ว่าถ้าวางผิดที่ ระบบมันจะพัง ผมเข้าใจว่า เราต้องวางโค๊ด Middleware ไว้ตั้งแต่ req เพราะมันจะได้ตรวจสอบก่อน res แต่ไม่ใช่เลย

ผมจำเป็นต้องให้ ai ช่วยไกด์ให้ ไม่ว่าจะเป็นชื่อ method การติดตั้งระบบต่างๆ เพื่อให้สามารถรันเซิร์ฟเวอร์ แล้วก็ TEST CRUD ได้
