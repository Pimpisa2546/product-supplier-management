import { UploadFile } from 'antd';
import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const handleImagePreview = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src && file.originFileObj) {
    src = await getBase64(file.originFileObj as FileType);
  }
  if (src) {
    const imgWindow = window.open(src);
    if (imgWindow) {
      imgWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Image Preview</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#000; min-height:100vh;">
            <img src="${src}" style="max-width:100%; max-height:100vh; object-fit:contain;" />
          </body>
        </html>
      `);
      imgWindow.document.close();
    }
  }
};