
export function base64UrlDecode(str: string) {
	str = str.replace(/-/g, "+").replace(/_/g, "/");
	const pad = str.length % 4;
	if (pad) str += "=".repeat(4 - pad);
	try {
		return decodeURIComponent(
			atob(str)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);
	} catch{
		return atob(str);
	}
}

export function getToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("token");
}

export function getUserIdFromToken(): number | null {
	const token = getToken();
	if (!token) return null;
	try {
		const parts = token.split(".");
		if (parts.length < 2) return null;
		const payload = JSON.parse(base64UrlDecode(parts[1]));
		const sub = payload.sub ?? payload.userId ?? payload.id;
		if (!sub) return null;
		const n = Number(sub);
		return Number.isNaN(n) ? null : n;
	} catch{
		return null;
	}
}

