import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import supabase from '../../../supabase/supabase';

export default class EmailController {
  protected transporter: Transporter<SMTPTransport.SentMessageInfo> | undefined;

  constructor() {
    this.init();
  }

  protected init() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM, // 보내는 메일의 주소
        pass: process.env.GOOGLE_EMAIL_PASSWORD_KEY,
      },
    });
  }

  gererateToken() {
    let number = '';

    const date = new Date();
    date.setMinutes(date.getMinutes() + 3);

    const endedAt = date.toISOString();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return {
      token: Number(number),
      endedAt,
    };
  }

  async sendMail(email: string) {
    if (!this.transporter) {
      this.init();
      return { errorMessage: 'transporter is not defined' };
    }

    const { endedAt, token } = this.gererateToken();

    const { error } = await supabase
      .from('verify-email')
      .insert({ token, email, ended_at: endedAt });
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '갭잘알 인증코드',
      text: `인증코드: ${token} 입니다`,
    });

    return { errorMessage: error?.message };
  }

  async verifyToken(email: string, token: number) {
    const { data, error: getTokenError } = await supabase
      .from('verify-email')
      .select('*')
      .eq('token', token)
      .eq('email', email);

    const { error: delelteError } = await supabase
      .from('verify-email')
      .delete()
      .eq('email', email);

    if (getTokenError || delelteError || !data || data.length === 0) {
      return {
        isVerify: false,
        message:
          delelteError?.message ||
          getTokenError?.message ||
          '인증에 실패했습니다',
      };
    }

    const { ended_at: endedAt } = data[0];

    if (new Date(endedAt).getTime() < new Date().getTime()) {
      return {
        isVerify: false,
        message: '만료된 인증번호입니다',
      };
    }

    return {
      isVerify: true,
      message: '인증에 성공했습니다',
    };
  }
}
