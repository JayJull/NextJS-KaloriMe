# **KaloriMe - Capstone Project Coding Camp CC25-CF192**
## Latar Belakang 
Aplikasi KaloriMe dirancang untuk membantu pengguna (wanita) mengelola asupan kalori harian secara efektif. Dengan membuat fitur pencatatan makanan, perhitungan kalori otomatis dan warning/ notifikasi batas kalori harian, Aplikasi KaloriMe bertujuan untuk meningkatkan kesadaran wanita dalam pentingnya pola makan sehat dan gaya hidup sehat. Proyek ini dibuat dengan mengintegrasikan machine learning didalamnya, yang bertujuan untuk memprediksi gambar makanan secara akurat dan memprediksi jumlah kalori tiap gambar yang di upload, serta dalam pengembangan front-end dan back-end memberikan pengalaman kepada pengguna untuk membuat aplikasi yang user-friendly. Tujuan kami menciptakan aplikasi KaloriMe ini supaya memberikan dampak positif dan perubahan signifikan terhadap wanita dalam mencapai dan mempertahankan berat badan ideal dan nutrisi yang seimbang.<br>
![alt text](./logo/kalori.jpg)<br>

## Alasan & Motivasi
Indonesia seringkali kita temui setiap individu dewasa **(wanita)** yang kesusahan dalam mengontrol dan mencatat kalori makanan yang telah dikomsumsi setiap harinya.<br>
Pola makan yang tidak seimbang adalah masalah kesehatan masyarakat yang serius di Indonesia, yang dimana sering terjadinya tidak mengetahui berapa banyak kalor yang telah dikomsumsi dari makanan tersebut sehingga mengakibatkan obesitas dan pola hidup yang tidak teratur, inilah mengapa tim kami menciptakan aplikasi *KaloriMe* untuk masyarakat terutama **wanita**. dengan menciptakan aplikasi *KaloriMe* ini pengguna **(wanita)** sadar akan pola makan yang seimbang dan literasi Gizi yang dikomsumsi pada tiap makananan. serta dapat menciptakan pengelolaan berat badan yang sehat dan ideal terhadap wanita dalam proses diet serta memberikan edukasi yang relevan dalam pemilihan makanan yang cocok dan kalori yang disarankan pada tiap harinya. dengan itulah tim kami berkolaborasi menciptakan aplikasi *KaloriMe* untuk pengguna yang sadar akan pentingnya dalam pola makan yang sehat serta Gizi yang seimbang.<br>

## Tujuan Project
Pada pengembangan aplikasi *KaloriMe* ini, tujuan utama dari proyek ini adalah untuk mengembangkan sistem klasifikasi makanan dengan beberapa fitur yaitu :
- Melakukan Klasifikasi Gambar : dengan menggunakan model **MobileNetV2** untuk melatih model pada klasifikasi gambar, yang menentukan hasil makanan yang *akurat* atau *tidak akurat* untuk dikomsumsi oleh wanita diet.
- Upload makanan : membuat fitur apload makanan yang bertujuan untuk melakukan hasil confident dari gambar yang diprediksi.
- Pencatatan Kalori makanan otomatis : pada pembuatan aplikasi *KaloriMe*, tim kami mengembangkan aplikasi ini untuk memudahkan pengguna **(wanita)** dalam pencatatan kalori makananan secara berkala.
- Laporan : Tim kami membuat fitur laporan bertujuan untuk memberikan peringatan/notifikasi pada pengguna **(wanita)**.


## Learning Path 
### Machine Learning
- Tools: Google Colab, Huggingface Space, Visual Studio Code
- Framework: Tensorflow, Keras, Flask
- Bahasa Pemrograman: Python 

### Front-End & Back-End
- Tools: Figma
- Bahasa pemrograman: JavaScript, Node.js, React.js

### Dataset

### Implementation 
Pada pengimplementasian proyek ini melibatkan pengembangan sistem dengan mengupload makanan yang memberikan hasil *name_class* dan *confident* dari gambar yang diupload pada aplikasi. dengan ini menggunakan pemrosesan model dari **MobilNetV2** yang telah dilatih sebelumnya. setelah melakukan penguploadan gambar makanan maka secara otomatis mendapatkan hasil *jumlah kalori, name_class, confident* dari gambar tersebut.Aplikasi *KaloriMe* ini memberikan kemudahan bagi pengguna dalam proses diet/pola makan yang seimbang.

### Target Pasar
Dengan pengembangan aplikasi *KaloriMe* ini bisa dapat dikembangkan di pasar industri untuk digunakan oleh pihak tertentu dengan :
- Memberikan keuntungan pada pengguna dalam pola makan seimbang dan Gizi yang seimbang
- Memudahkan pengguna dalam pencatatan kalori makanan secara berkala.
- Memberikan edukasi tentang pola makan yang sehat dan jumlah kalori yang akan dikomsumsi setiap harinya.<br>

## Tim Capstone

| ID          | Name                      | Institution                      | Role                           | Status |
|-------------|---------------------------|----------------------------------|--------------------------------|--------|
| MC319D5Y1574		| Ananda Kelvin Power Situmorang     | Sumatera Utara   | Machine Learning Engineering | Active |
| MC404D5X0047		| Merri Putri Cristina Sani Panggabean       | Politeknik Negeri Batam | Machine Learning Engineering     | Active |
| MC189D5X1561		| Evelyn Eunike Aritonang | Universitas Bengkulu | Machine Learning Engineering    | Active |
| FC525D5Y0007		| Mohamad Joko | Politeknik Negeri Banyuwangi            | Front-End & Back-End               | Active |
| FC525D5Y0106 | Mohammad Zidan Caesar Pratama          | Politeknik Negeri Banyuwangi      | ront-End & Back-End                | Active |
| FC525D5Y0109 | Muhammad Izza Fakhrul Anam      | Politeknik Negeri Banyuwangi    | ront-End & Back-End             | Active |


### Kesimpulan 
Pada proyek Aplikasi *KaloriMe* ini merupakan langkah awal penting dalam mengembangkan pembelajaran mesin serta memanfaatkan model yang dilatih dalam mengatasi masalah obesitas pada makanan dan memberikan pola makan yang seimbang. dengan memberikan edukasi dibalik fitur yang dibuat serta memudahkan pengguna dalam penggunaan aplikasi pada setiap personalisasi disaat mengalami masalah diet yang tidak konsisten. tim kami berharap dengan mengembangkan aplikasi *KaloriMe* dapat memberikan kemudahan pada pengguna untuk lebih *aware* pada makanan yang dikomsumsi.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
