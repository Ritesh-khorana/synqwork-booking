import nodemailer from "nodemailer";

export async function sendBookingEmails(input: {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  roomName: string;
  centreName: string;
  city: string;
  address: string;
  date: string;
  time: string;
  amount: number;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;
  if (!host || !user || !pass || !from) return;

  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  const subject = `Booking Confirmed - ${input.bookingId}`;
  const body = `Booking ID: ${input.bookingId}\nRoom: ${input.roomName}\nCentre: ${input.centreName}\nCity: ${input.city}\nAddress: ${input.address}\nDate: ${input.date}\nTime: ${input.time}\nAmount: ₹${input.amount}`;

  await transporter.sendMail({ from, to: input.customerEmail, subject, text: `Hi ${input.customerName},\n\n${body}` });
  await transporter.sendMail({ from, to: "digitalmedia@synq.work", subject: `Admin Copy - ${subject}`, text: body });
}
