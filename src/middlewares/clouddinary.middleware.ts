import cloud from "cloudinary"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import * as dotenv from 'dotenv'
dotenv.config()

const cloudinary = cloud.v2

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})

const configStorage = (folder: string) => {
	const storage = new CloudinaryStorage({
		cloudinary,
		params: async () => {
			return {
				folder: `Barber/${folder}`,
				resource_type: 'auto', // để cloudinary nhận vào cái file audio/*
				allowedFormats: ['mp3', 'jpg', 'png', 'jpeg', 'gif', 'mpeg', 'pdf', 'doc', 'docx'],
			}
		},
	})

	return multer({ storage })
}

export default configStorage
