import cloudinary from "@/lib/cloudinary";

export async function uploadToCloudinary(file: File, folder: string) {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: folder,
            },
            (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve(result);
            }
        );
        uploadStream.end(bytes);
    });
}
