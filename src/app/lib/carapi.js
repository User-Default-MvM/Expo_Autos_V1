const BASE_URL = "https://carapi.app/api";

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

async function getJwt() {
const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_token: API_TOKEN, api_secret: API_SECRET }),
});

if (!res.ok) throw new Error("No se pudo obtener el JWT");

// Aquí usamos text() porque la respuesta es un string plano
const token = await res.text();
return token;
}

export async function getCarMakes() {
try {
const jwt = await getJwt();

const res = await fetch(`${BASE_URL}/makes`, {
    headers: {
    Authorization: `Bearer ${jwt}`,
    Accept: "application/json",
    },
    next: { revalidate: 3600 },
});

if (!res.ok) throw new Error(`Error al obtener las marcas: ${res.status}`);

const data = await res.json();
return data.data || [];
} catch (error) {
console.error("Error en getCarMakes:", error);
return [];
}
}
