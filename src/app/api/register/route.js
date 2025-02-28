import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      if (res.confirm) {
        // ตรวจสอบรหัสยืนยัน
        const { PIN_confirm, PIN, requestDataUser } = res;

        if (PIN_confirm === PIN) {
          const { name, last_name, email, position, employee, password } = requestDataUser;

          let insertSql;
          let tableName;

          // ตรวจสอบตำแหน่งงานและเลือกตารางที่เหมาะสม
          if (position === 'Safety Officer Professional level') {
            tableName = 'users';
          } else if (position === 'Safety Officer Technical level') {
            tableName = 'users_r2';
          } else if (position === 'Safety Officer Supervisory level') {
            tableName = 'users_r3';
          } else if (position === 'Administrator') {
            tableName = 'role_admin';
          } else {
            return NextResponse.json({ success: false, error: 'Invalid position' });
          }

          // เตรียมคำสั่ง SQL
          insertSql = `
            INSERT INTO ${tableName} (name, lastname, email, position, employee, password, phone, line, picture)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const insertValues = [name, last_name, email, position, employee, password, '', '', ''];

          // บันทึกข้อมูลลงในฐานข้อมูล
          const result = await db.query(insertSql, insertValues);

          if (result[0].affectedRows === 1) {
            const insertedId = result[0].insertId;
            return NextResponse.json({ success: true, id: insertedId, redirect: '/register' });
          } else {
            return NextResponse.json({ success: false, error: 'Failed to insert user data' });
          }
        } else {
          return NextResponse.json({ success: false, error: "Verification PIN doesn't match" });
        }
      } else {
        // ตรวจสอบอีเมลและพนักงานในทุกตาราง
        const { name, last_name, email, position, employee, password } = res;

        const checkQueries = [
          { query: 'SELECT COUNT(*) AS count FROM users WHERE email = ? OR employee = ?', table: 'users' },
          { query: 'SELECT COUNT(*) AS count FROM users_r2 WHERE email = ? OR employee = ?', table: 'users_r2' },
          { query: 'SELECT COUNT(*) AS count FROM users_r3 WHERE email = ? OR employee = ?', table: 'users_r3' },
          { query: 'SELECT COUNT(*) AS count FROM role_admin WHERE email = ? OR employee = ?', table: 'role_admin' },
        ];

        for (const check of checkQueries) {
          const [result] = await db.query(check.query, [email, employee]);
          if (result[0].count > 0) {
            return NextResponse.json({ success: false, error: `${check.table} already contains this email or employee` });
          }
        }

        // ส่งรหัสยืนยัน
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const confirmationCode = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Confirmation Code for JorPor',
          html: `
            <p>สวัสดี ${name},</p>
            <p>โปรดยืนยันบัญชีของคุณ:</p>
            <p>รหัสยืนยัน: <strong>${confirmationCode}</strong></p>
            <p>ขอบคุณที่ใช้บริการ JorPor!</p>
          `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
          success: true,
          message: 'Confirmation code sent. Please check your email.',
          PINconfirm: confirmationCode,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.json({ success: false, error: 'Invalid request method' });
  }
}