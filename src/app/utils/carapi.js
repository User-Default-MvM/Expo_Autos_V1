// utils/carapi/js

// utils/carapi.js
const API_KEY = process.env.NEXT_PUBLIC_CARAPI_KEY;
const BASE_URL = "https://carapi.app/api";

export async function getCarMakes() {
try {
const res = await fetch(`${BASE_URL}/makes`, {
    headers: {
    Authorization: `Bearer ${API_KEY}`,
    },
});

if (!res.ok) throw new Error("Error al obtener marcas");

const data = await res.json();
return data.data; // La respuesta tiene esta forma
} catch (error) {
console.error("Error en getCarMakes:", error);
return [];
}
}
