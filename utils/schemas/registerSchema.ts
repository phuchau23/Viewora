// schemas/registerSchema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    Email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
    FullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    DateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
    Gender: z.number({ required_error: "Vui lòng chọn giới tính" }).refine((val) => [0, 1, 2].includes(val), "Giới tính không hợp lệ"),
    PhoneNumber: z.string().regex(/^\+?\d{10,15}$/, "Số điện thoại không hợp lệ"),
    Password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    ConfirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["ConfirmPassword"],
  });

// Tạo kiểu RegisterRequest chỉ bao gồm các trường gửi đi
export type RegisterRequest = Omit<
  z.infer<typeof registerSchema>,
  "ConfirmPassword"
> & { ConfirmPassword: string };