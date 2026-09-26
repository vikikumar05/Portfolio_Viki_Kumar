export const ok = (res, message, data = {}, code = 200) => res.status(code).json({ success: true, message, data });
export const fail = (res, message, code = 400) => res.status(code).json({ success: false, message });
