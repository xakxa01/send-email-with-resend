import { Router } from 'express'
import { Resend } from 'resend';
import { config } from 'dotenv'
import htmlTemplate from '../components/htmlTemplate.js';

config()

const resend = new Resend(process.env.RESEND_API_KEY)

const router = Router()

router
	.post("/", async (req, res) => {
		const body = req.body

		const { attachments } = body;
		const title = 'Ayuda Concho'
		const subject = 'Report'
		const html = htmlTemplate(body)

		const { data, error } = await resend.emails.send({
			from: `${title} <${process.env.EMAIL_SENDER}>`,
			to: process.env.EMAIL_TO_SEND,
			subject,
			html,
			attachments: !attachments ? null : attachments.map((file) => ({
				filename: file.filename,
				content: file.content
			})),
		});

		if (error) return res.status(400).json({ error });

		res.status(200).json({ data });
	});

export default router