import qrcode from 'qrcode';
import nodemailer from 'nodemailer';
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'j26zfvdk',
    dataset: '<your-dataset-name>',
    useCdn: true // Set this to false if you want to retrieve the latest version of your data
});

const generateQRCode = async (studentData) => {
    const qrcodeData = {
        name: studentData.name,
        id: studentData._id,
        email: studentData.email,
        mobile: studentData.mobile,
        items: studentData.items
    };

    const qrString = JSON.stringify(qrcodeData);

    // generate QR code using qrcode library
    const qrCode = await QRCode.toDataURL(qrString);

    // create image using jimp library
    const image = await new Promise((resolve, reject) => {
        new Jimp(QR_CODE_SIZE, QR_CODE_SIZE, '#ffffff', (err, image) => {
            if (err) {
                reject(err);
            } else {
                resolve(image);
            }
        });
    });

    // add QR code to image
    const qrImage = await Jimp.read(qrCode);
    const x = (QR_CODE_SIZE - qrImage.bitmap.width) / 2;
    const y = (QR_CODE_SIZE - qrImage.bitmap.height) / 2;
    image.composite(qrImage, x, y);

    // convert image to buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

    return buffer;
}