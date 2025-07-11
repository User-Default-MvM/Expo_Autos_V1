import { brandDomains } from "../lib/carLogos";

export default function BrandCard({ brand }) {
const domain = brandDomains[brand.name];
const logoUrl = domain
    ? `https://logo.clearbit.com/${domain}`
    : "https://via.placeholder.com/150?text=Auto";

return (
    <div className="bg-white rounded-lg shadow-md p-6 w-64 hover:shadow-xl transition-shadow duration-300 text-black">
    <img
        src={logoUrl}
        alt={`Logo de ${brand.name}`}
        className="w-full h-32 object-contain mb-4"
    />
    <h3 className="text-xl font-semibold mb-2 text-center">{brand.name}</h3>
    </div>
);
}
