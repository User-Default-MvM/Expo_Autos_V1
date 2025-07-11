import { getCarMakes } from "../lib/carapi";
import BrandCard from "../components/BrandCard";

export default async function PartsPage() {
const brands = await getCarMakes();
console.log(brands);

return (
<main className="p-8 bg-gray-200 min-h-screen">
    <h1 className="text-3xl font-bold mb-8 text-center text-black">Marcas de Autos</h1>
    <div className="flex flex-wrap justify-center gap-6">
    {brands.length > 0 ? (
        brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
    ) : (
        <p className="text-black">No se encontraron marcas</p>
    )}
    </div>
</main>
);
}
