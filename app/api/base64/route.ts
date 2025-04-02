import { NextResponse } from 'next/server';
import sharp from 'sharp';

// Handler untuk POST request
export async function POST(req: Request) {
  try {
    // Parsing file dari request
    const buffer = await req.arrayBuffer(); // Mengambil data file sebagai ArrayBuffer
    const resizedImageBuffer = await sharp(Buffer.from(buffer))
      .resize(200, 200) // Resize gambar menjadi 200x200
      .toFormat('jpeg') // Mengubah format menjadi JPEG
      .jpeg({ quality: 50 }) // Menurunkan kualitas gambar menjadi 50%
      .toBuffer(); // Menghasilkan buffer gambar

    // Mengubah buffer menjadi string base64
    const base64Image = resizedImageBuffer.toString('base64');

    // Mengembalikan response dalam bentuk base64 image
    return NextResponse.json({
      base64Image: `data:image/jpeg;base64,${base64Image}`,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ message: 'Error processing image' }, { status: 500 });
  }
}
