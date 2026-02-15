import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.mjs";
import User from "./models/User.mjs";
import Order from "./models/Order.mjs";
import FeaturedProducts from "./models/FeaturedProducts.mjs";

dotenv.config({ path: "./.env" });

const DATABASE_URL = process.env.DATABASE_URL;

// ─── PRODUCT TEMPLATES WITH PER-PRODUCT IMAGES ─────────────────────────────
// Each product has 4 unique images showing the same type of furniture from different angles
const categories = ["Bedroom", "Sofa", "Office", "Outdoor", "Kitchen", "Dining", "Living Room", "Lighting"];
const brands = ["APEX", "Call of SOFA", "Puff B&G", "Fornighte", "UrbanNest", "WoodCraft"];
const validColors = ["#4B5563", "#4C1D95", "#7F1D1D", "#1E3A5F", "#065F46", "#92400E", "#D97706", "#0369A1", "#BE185D"];

function pick(arr, min = 1, max = 3) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function price(min, max) {
    return +((Math.random() * (max - min) + min) * 85).toFixed(0);
}

const productTemplates = [
    // ── BEDROOM ──
    {
        name: "Royal King Bed Frame", category: "Bedroom", brand: "APEX", priceRange: [899, 1299],
        desc: "Luxurious king-size bed frame crafted from solid oak with a rich walnut finish. Features an elegant headboard with tufted upholstery.",
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
            "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600",
            "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
        ]
    },
    {
        name: "Modern Platform Bed", category: "Bedroom", brand: "Fornighte", priceRange: [599, 899],
        desc: "Sleek modern platform bed with built-in LED lighting and USB charging ports. Low-profile design perfect for contemporary bedrooms.",
        images: [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
            "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=600",
            "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600",
            "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600",
        ]
    },
    {
        name: "Classic Wooden Nightstand", category: "Bedroom", brand: "Puff B&G", priceRange: [149, 299],
        desc: "Handcrafted wooden nightstand with two spacious drawers and a clean minimalist design. Perfect companion for any bed.",
        images: [
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600",
            "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
        ]
    },
    {
        name: "Upholstered Queen Bed", category: "Bedroom", brand: "Call of SOFA", priceRange: [699, 999],
        desc: "Plush velvet upholstered queen bed with a tall wingback headboard. Includes solid slat support system — no box spring needed.",
        images: [
            "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
            "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600",
        ]
    },
    {
        name: "Scandinavian Dresser", category: "Bedroom", brand: "APEX", priceRange: [449, 699],
        desc: "6-drawer dresser in light birch wood with tapered legs. Scandinavian-inspired design that brings warmth and function.",
        images: [
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600",
            "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600",
        ]
    },
    {
        name: "Canopy Bedroom Set", category: "Bedroom", brand: "Fornighte", priceRange: [1499, 2199],
        desc: "Complete 4-piece canopy bedroom set including bed, two nightstands, and dresser. Matte black metal frame with gold accents.",
        images: [
            "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600",
        ]
    },
    {
        name: "Floating Wall Shelf Set", category: "Bedroom", brand: "Puff B&G", priceRange: [79, 149],
        desc: "Set of 3 floating wall shelves in stained pine wood. Perfect for displaying photos, books, and decorative items.",
        images: [
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600",
            "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600",
        ]
    },
    {
        name: "Memory Foam Mattress Premium", category: "Bedroom", brand: "APEX", priceRange: [599, 999],
        desc: "12-inch premium memory foam mattress with cooling gel technology. CertiPUR-US certified foam for a healthier sleep.",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
            "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=600",
            "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
        ]
    },
    {
        name: "Velvet Accent Chair Bedroom", category: "Bedroom", brand: "Call of SOFA", priceRange: [249, 399],
        desc: "Compact velvet accent chair with gold-finished metal legs. A stylish addition to any bedroom reading corner.",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
        ]
    },
    {
        name: "Rustic Wooden Wardrobe", category: "Bedroom", brand: "Fornighte", priceRange: [799, 1199],
        desc: "Spacious rustic wardrobe with sliding barn-style doors. Features hanging rod, shelves, and two bottom drawers.",
        images: [
            "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600",
        ]
    },
    {
        name: "LED Vanity Mirror Desk", category: "Bedroom", brand: "Puff B&G", priceRange: [299, 499],
        desc: "Hollywood-style vanity desk with built-in LED mirror and 5 drawers. Dimmable lights with 3 color temperature settings.",
        images: [
            "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
            "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600",
        ]
    },
    {
        name: "Linen Storage Ottoman Bed", category: "Bedroom", brand: "APEX", priceRange: [449, 699],
        desc: "Ottoman bed with hydraulic lift mechanism revealing massive under-bed storage. Upholstered in premium linen fabric.",
        images: [
            "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=600",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
        ]
    },

    // ── SOFA ──
    {
        name: "L-Shaped Sectional Sofa", category: "Sofa", brand: "Call of SOFA", priceRange: [1299, 1999],
        desc: "Premium L-shaped sectional sofa with chaise lounge. Deep-seated cushions filled with high-density foam for ultimate comfort.",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
        ]
    },
    {
        name: "Mid-Century Modern Loveseat", category: "Sofa", brand: "APEX", priceRange: [549, 849],
        desc: "Retro-inspired loveseat with walnut-finished tapered legs. Button-tufted backrest in premium tweed fabric.",
        images: [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
        ]
    },
    {
        name: "Convertible Sleeper Sofa", category: "Sofa", brand: "Fornighte", priceRange: [699, 1099],
        desc: "3-in-1 convertible sofa that transforms from sofa to lounger to bed. Perfect for studio apartments and guest rooms.",
        images: [
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
        ]
    },
    {
        name: "Chesterfield Leather Sofa", category: "Sofa", brand: "Call of SOFA", priceRange: [1899, 2799],
        desc: "Handcrafted Chesterfield sofa in genuine top-grain leather. Deep button tufting and rolled arms for classic elegance.",
        images: [
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
        ]
    },
    {
        name: "Cloud Comfort Recliner", category: "Sofa", brand: "Puff B&G", priceRange: [499, 799],
        desc: "Power recliner with infinite positioning and built-in USB port. Memory foam padding molds to your body shape.",
        images: [
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
        ]
    },
    {
        name: "Modular Corner Sofa Set", category: "Sofa", brand: "APEX", priceRange: [1599, 2399],
        desc: "Customizable 5-piece modular sofa set. Rearrange sections to fit any room layout. Stain-resistant microfiber fabric.",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
        ]
    },
    {
        name: "Scandinavian 3-Seater Sofa", category: "Sofa", brand: "Fornighte", priceRange: [799, 1199],
        desc: "Clean-lined 3-seater with solid beech legs and removable cushion covers. Minimalist design meets maximum comfort.",
        images: [
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
        ]
    },
    {
        name: "Tufted Velvet Sofa", category: "Sofa", brand: "Call of SOFA", priceRange: [899, 1399],
        desc: "Show-stopping velvet sofa with channel tufting and gold metal legs. Available in emerald, navy, and blush.",
        images: [
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
        ]
    },
    {
        name: "Outdoor Patio Sofa Set", category: "Sofa", brand: "Puff B&G", priceRange: [999, 1599],
        desc: "Weather-resistant wicker patio sofa set with all-weather cushions. Includes sofa, loveseat, and coffee table.",
        images: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
        ]
    },
    {
        name: "Japanese Futon Sofa Bed", category: "Sofa", brand: "APEX", priceRange: [349, 549],
        desc: "Minimalist Japanese-inspired futon that folds into a compact sofa. Breathable cotton-linen blend cover.",
        images: [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
        ]
    },
    {
        name: "Italian Leather Loveseat", category: "Sofa", brand: "Call of SOFA", priceRange: [1099, 1699],
        desc: "Handmade Italian leather loveseat with chrome steel frame. Butter-soft aniline leather develops beautiful patina over time.",
        images: [
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600",
        ]
    },
    {
        name: "Bohemian Floor Sofa", category: "Sofa", brand: "Fornighte", priceRange: [299, 499],
        desc: "Low-profile floor sofa with colorful kilim-style upholstery. Perfect for casual bohemian living spaces.",
        images: [
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600",
        ]
    },

    // ── OFFICE ──
    {
        name: "Executive Ergonomic Chair", category: "Office", brand: "APEX", priceRange: [399, 699],
        desc: "Full-featured ergonomic office chair with adjustable lumbar, armrests, headrest, and seat depth. Breathable mesh back.",
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
        ]
    },
    {
        name: "Standing Desk Electric", category: "Office", brand: "Fornighte", priceRange: [549, 899],
        desc: "Electric height-adjustable standing desk with memory presets. Bamboo desktop surface with cable management tray.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
        ]
    },
    {
        name: "Modern Bookshelf Unit", category: "Office", brand: "Puff B&G", priceRange: [199, 399],
        desc: "5-tier open bookshelf with industrial metal frame and engineered wood shelves. Perfect for books and display items.",
        images: [
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
        ]
    },
    {
        name: "Corner Computer Desk", category: "Office", brand: "Call of SOFA", priceRange: [249, 449],
        desc: "L-shaped corner desk with monitor riser shelf. Large desktop area with built-in cable grommets and headphone hook.",
        images: [
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
        ]
    },
    {
        name: "Filing Cabinet Modern", category: "Office", brand: "APEX", priceRange: [149, 299],
        desc: "3-drawer mobile filing cabinet with lock. Smooth rolling casters and modern matte finish complement any office.",
        images: [
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
        ]
    },
    {
        name: "Mesh Task Chair Pro", category: "Office", brand: "Fornighte", priceRange: [199, 349],
        desc: "Affordable mesh task chair with flip-up arms and breathable back. 360-degree swivel and adjustable height.",
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
        ]
    },
    {
        name: "Walnut Writing Desk", category: "Office", brand: "Puff B&G", priceRange: [349, 599],
        desc: "Solid walnut writing desk with two built-in drawers. Clean mid-century design suits home or professional offices.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
        ]
    },
    {
        name: "Conference Table 8-Seat", category: "Office", brand: "APEX", priceRange: [999, 1599],
        desc: "8-person conference table with power and data ports. Scratch-resistant laminate surface in espresso finish.",
        images: [
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
        ]
    },
    {
        name: "Wall-Mounted Desk Fold", category: "Office", brand: "Call of SOFA", priceRange: [179, 299],
        desc: "Space-saving wall-mounted folding desk. Opens to a full workspace and folds flat when not in use.",
        images: [
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
        ]
    },
    {
        name: "Leather Office Chair Classic", category: "Office", brand: "Fornighte", priceRange: [299, 499],
        desc: "Classic high-back leather office chair with padded arms and tilt lock. Thick bonded leather with contrast stitching.",
        images: [
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
        ]
    },
    {
        name: "Monitor Arm Dual Stand", category: "Office", brand: "Puff B&G", priceRange: [79, 149],
        desc: "Heavy-duty dual monitor arm supporting screens up to 32 inches. Full motion articulation with cable management.",
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
        ]
    },
    {
        name: "Acoustic Office Pod", category: "Office", brand: "APEX", priceRange: [2499, 3999],
        desc: "Soundproof office pod for open-plan offices. Ventilated with LED lighting, power outlets, and USB ports inside.",
        images: [
            "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600",
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
        ]
    },

    // ── OUTDOOR ──
    {
        name: "Teak Garden Dining Set", category: "Outdoor", brand: "Fornighte", priceRange: [1299, 1999],
        desc: "Premium teak wood 6-person garden dining set. Weather-resistant and naturally beautiful — ages to a silver-grey patina.",
        images: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Hanging Egg Chair", category: "Outdoor", brand: "APEX", priceRange: [399, 699],
        desc: "Rattan hanging egg chair with steel stand and plush cushion. UV-resistant wicker weave for years of outdoor enjoyment.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Fire Pit Table Set", category: "Outdoor", brand: "Puff B&G", priceRange: [799, 1299],
        desc: "Propane gas fire pit table with 4 Adirondack chairs. 50,000 BTU burner creates a warm, cozy outdoor gathering spot.",
        images: [
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
        ]
    },
    {
        name: "Patio Umbrella Cantilever", category: "Outdoor", brand: "Call of SOFA", priceRange: [249, 449],
        desc: "10-foot cantilever patio umbrella with 360-degree rotation. Fade-resistant Sunbrella fabric with easy crank mechanism.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Wicker Lounge Chair Set", category: "Outdoor", brand: "Fornighte", priceRange: [599, 899],
        desc: "Set of 2 adjustable wicker lounge chairs with cushions and side table. Rust-resistant aluminum frame.",
        images: [
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Outdoor Storage Bench", category: "Outdoor", brand: "APEX", priceRange: [199, 349],
        desc: "Dual-purpose outdoor storage bench holding up to 120 gallons. Weather-proof resin construction looks like real wood.",
        images: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Garden Swing Bench", category: "Outdoor", brand: "Puff B&G", priceRange: [349, 599],
        desc: "3-person garden swing bench with adjustable canopy. Powder-coated steel frame and fade-resistant fabric.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
        ]
    },
    {
        name: "Folding Bistro Set", category: "Outdoor", brand: "Call of SOFA", priceRange: [149, 249],
        desc: "Charming folding bistro set with 2 chairs and a round table. Perfect for small balconies and patios.",
        images: [
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
        ]
    },
    {
        name: "Outdoor Bar Cart Trolley", category: "Outdoor", brand: "Fornighte", priceRange: [199, 349],
        desc: "Rolling outdoor bar cart with removable ice bucket. Teak and stainless steel construction resists the elements.",
        images: [
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
        ]
    },
    {
        name: "Pergola Shade Structure", category: "Outdoor", brand: "APEX", priceRange: [899, 1499],
        desc: "10x12 ft aluminum pergola with adjustable louvered roof. Motorized louvers let you control sun and shade with ease.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
        ]
    },
    {
        name: "Adirondack Chair Cedar", category: "Outdoor", brand: "Puff B&G", priceRange: [199, 349],
        desc: "Classic Adirondack chair hand-crafted from western red cedar. Contoured seat and wide armrests for relaxation.",
        images: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Outdoor Daybed Canopy", category: "Outdoor", brand: "Call of SOFA", priceRange: [999, 1599],
        desc: "Luxurious outdoor daybed with retractable canopy. Wicker base with 6-inch thick Sunbrella cushions.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
        ]
    },

    // ── KITCHEN ──
    {
        name: "Marble Kitchen Island", category: "Kitchen", brand: "UrbanNest", priceRange: [1299, 1999],
        desc: "Luxurious kitchen island with Carrara marble top and solid wood base. Features built-in storage shelves and towel rack.",
        images: [
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
            "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600",
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600",
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600",
        ]
    },
    {
        name: "Industrial Bar Stools Set", category: "Kitchen", brand: "APEX", priceRange: [249, 449],
        desc: "Set of 4 industrial-style counter-height bar stools with adjustable swivel seats. Solid wood top with metal frame.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600",
        ]
    },
    {
        name: "Bamboo Spice Rack Organizer", category: "Kitchen", brand: "WoodCraft", priceRange: [49, 99],
        desc: "3-tier bamboo spice rack with pull-out drawers. Expandable design fits any cabinet or countertop.",
        images: [
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
            "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600",
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600",
        ]
    },
    {
        name: "Copper Pot Rack Ceiling", category: "Kitchen", brand: "Fornighte", priceRange: [149, 299],
        desc: "Elegant ceiling-mounted copper pot rack with 10 S-hooks. Adds rustic charm while keeping cookware within reach.",
        images: [
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600",
            "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600",
        ]
    },
    {
        name: "Kitchen Pantry Cabinet", category: "Kitchen", brand: "Puff B&G", priceRange: [399, 699],
        desc: "Tall freestanding pantry cabinet with adjustable shelves and glass-paneled doors. Stores dry goods and small appliances.",
        images: [
            "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600",
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600",
        ]
    },

    // ── DINING ──
    {
        name: "Farmhouse Dining Table", category: "Dining", brand: "WoodCraft", priceRange: [799, 1299],
        desc: "Solid reclaimed wood farmhouse dining table seating 8. Hand-distressed top with turned legs and trestle base.",
        images: [
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
        ]
    },
    {
        name: "Velvet Dining Chairs Set", category: "Dining", brand: "Call of SOFA", priceRange: [349, 599],
        desc: "Set of 4 luxe velvet dining chairs with gold-finished metal legs. Comfortable padded seats with elegant button tufting.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Glass Round Dining Table", category: "Dining", brand: "UrbanNest", priceRange: [499, 799],
        desc: "Contemporary round dining table with tempered glass top and sculptural chrome base. Seats 4 comfortably.",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
        ]
    },
    {
        name: "Mid-Century Sideboard", category: "Dining", brand: "APEX", priceRange: [599, 999],
        desc: "Walnut mid-century modern sideboard buffet with sliding doors and adjustable shelves. Brass hairpin legs.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
        ]
    },
    {
        name: "Wine Rack Cabinet", category: "Dining", brand: "Fornighte", priceRange: [299, 499],
        desc: "Elegant wine storage cabinet holding 28 bottles with glass rack and drawer. Rich espresso finish.",
        images: [
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
        ]
    },

    // ── LIVING ROOM ──
    {
        name: "TV Entertainment Center", category: "Living Room", brand: "UrbanNest", priceRange: [599, 999],
        desc: "Modern floating TV entertainment center with LED backlighting. Supports TVs up to 75 inches with hidden cable management.",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
        ]
    },
    {
        name: "Modular Bookshelf System", category: "Living Room", brand: "WoodCraft", priceRange: [399, 699],
        desc: "Configurable open bookshelf system with 12 cubes. Mix and match with doors and drawer inserts sold separately.",
        images: [
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
        ]
    },
    {
        name: "Accent Armchair Wingback", category: "Living Room", brand: "Call of SOFA", priceRange: [449, 749],
        desc: "Classic wingback accent armchair in premium linen fabric. Deep button tufting with nailhead trim and solid wood legs.",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
        ]
    },
    {
        name: "Ottoman Storage Bench", category: "Living Room", brand: "Puff B&G", priceRange: [199, 349],
        desc: "Tufted storage ottoman bench with flip-top lid. Linen upholstery with wooden legs, doubles as seating and storage.",
        images: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
        ]
    },
    {
        name: "Marble Coffee Table Round", category: "Living Room", brand: "APEX", priceRange: [349, 599],
        desc: "Elegant round coffee table with genuine Italian marble top and a brushed gold-tone metal base.",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
        ]
    },

    // ── LIGHTING ──
    {
        name: "Modern Arc Floor Lamp", category: "Lighting", brand: "UrbanNest", priceRange: [149, 299],
        desc: "Sleek arched floor lamp with brushed nickel finish and weighted marble base. Adjustable height up to 80 inches.",
        images: [
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
        ]
    },
    {
        name: "Crystal Chandelier Modern", category: "Lighting", brand: "Fornighte", priceRange: [399, 799],
        desc: "Contemporary crystal chandelier with chrome frame and hundreds of hand-cut K9 crystals. 6-light design for dining rooms.",
        images: [
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
        ]
    },
    {
        name: "Industrial Pendant Lights", category: "Lighting", brand: "WoodCraft", priceRange: [79, 149],
        desc: "Set of 3 vintage industrial pendant lights with Edison bulbs. Adjustable cord length with antique brass fittings.",
        images: [
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
        ]
    },
    {
        name: "Smart LED Table Lamp", category: "Lighting", brand: "APEX", priceRange: [59, 129],
        desc: "Touch-dimming LED table lamp with wireless charging base. 3 color temperatures and USB-C port. Minimalist design.",
        images: [
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
        ]
    },
    {
        name: "Rattan Woven Lamp Shade", category: "Lighting", brand: "Puff B&G", priceRange: [69, 139],
        desc: "Handwoven rattan pendant shade that casts beautiful dappled light patterns. Natural bohemian style for any room.",
        images: [
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
        ]
    },
];

// ─── USER DATA ──────────────────────────────────────────────────────────────
const users = [
    {
        fullName: "Admin User", email: "admin@ecommerce.com", username: "admin", password: "Admin@1234", passwordConfirm: "Admin@1234", phone: "+1-555-0100", role: "admin", gender: "male",
        address: [{ street1: "123 Admin Street", street2: "Suite 100", city: "New York", state: "NY", country: "USA", zip: "10001" }]
    },
    {
        fullName: "Krish User", email: "krish@gmail.com", username: "krish", password: "12345678", passwordConfirm: "12345678", phone: "+1-555-0200", role: "user", gender: "male",
        address: [{ street1: "123 Krish St", street2: "", city: "Mumbai", state: "MH", country: "India", zip: "400001" }]
    },
    {
        fullName: "John Smith", email: "john@example.com", username: "johnsmith", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0101", role: "user", gender: "male",
        address: [{ street1: "456 Oak Avenue", street2: "", city: "Los Angeles", state: "CA", country: "USA", zip: "90001" }]
    },
    {
        fullName: "Sarah Johnson", email: "sarah@example.com", username: "sarahj", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0102", role: "user", gender: "female",
        address: [{ street1: "789 Pine Road", street2: "Apt 4B", city: "Chicago", state: "IL", country: "USA", zip: "60601" }]
    },
    {
        fullName: "Michael Brown", email: "michael@example.com", username: "mikebrown", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0103", role: "user", gender: "male",
        address: [{ street1: "321 Elm Court", street2: "", city: "Houston", state: "TX", country: "USA", zip: "77001" }]
    },
    {
        fullName: "Emily Davis", email: "emily@example.com", username: "emilyd", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0104", role: "user", gender: "female",
        address: [{ street1: "654 Maple Lane", street2: "Unit 12", city: "Miami", state: "FL", country: "USA", zip: "33101" }]
    },
    {
        fullName: "David Wilson", email: "david@example.com", username: "davidw", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0105", role: "user", gender: "male",
        address: [{ street1: "987 Cedar Drive", street2: "", city: "Seattle", state: "WA", country: "USA", zip: "98101" }]
    },
    {
        fullName: "Jessica Miller", email: "jessica@example.com", username: "jessicam", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0106", role: "user", gender: "female",
        address: [{ street1: "147 Birch Street", street2: "Apt 7A", city: "Denver", state: "CO", country: "USA", zip: "80201" }]
    },
    {
        fullName: "Robert Taylor", email: "robert@example.com", username: "robt", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0107", role: "user", gender: "male",
        address: [{ street1: "258 Walnut Blvd", street2: "", city: "Boston", state: "MA", country: "USA", zip: "02101" }]
    },
    {
        fullName: "Amanda Garcia", email: "amanda@example.com", username: "amandag", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0108", role: "user", gender: "female",
        address: [{ street1: "369 Spruce Ave", street2: "Suite 5", city: "San Francisco", state: "CA", country: "USA", zip: "94101" }]
    },
    {
        fullName: "James Anderson", email: "james@example.com", username: "jamesa", password: "User@1234", passwordConfirm: "User@1234", phone: "+1-555-0109", role: "user", gender: "male",
        address: [{ street1: "741 Ash Way", street2: "", city: "Phoenix", state: "AZ", country: "USA", zip: "85001" }]
    },
];

// ─── SEED FUNCTION ──────────────────────────────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});
        await FeaturedProducts.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // ── Seed Products (images already embedded in templates) ──
        const productsToInsert = productTemplates.map((tpl) => {
            return {
                name: tpl.name,
                price: price(tpl.priceRange[0], tpl.priceRange[1]),
                desc: tpl.desc,
                stock: rand(5, 200),
                images: tpl.images,  // Use the per-product images directly
                brand: tpl.brand,
                category: tpl.category,
                size: [],  // No sizes for furniture products
                colors: pick(validColors, 1, 3),
            };
        });

        const insertedProducts = await Product.insertMany(productsToInsert);
        console.log(`📦 Inserted ${insertedProducts.length} products`);

        // ── Seed Users ──
        const insertedUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            insertedUsers.push(user);
        }
        console.log(`👤 Inserted ${insertedUsers.length} users`);

        // ── Seed Orders ──
        const statuses = ["pending", "accepted", "rejected"];
        const ordersToCreate = [];

        for (let i = 0; i < 25; i++) {
            const user = insertedUsers[rand(1, insertedUsers.length - 1)];
            const orderProducts = pick(insertedProducts, 1, 4);
            const totalPrice = orderProducts.reduce((sum, p) => sum + p.price, 0);

            ordersToCreate.push({
                date: new Date(Date.now() - rand(0, 90) * 24 * 60 * 60 * 1000),
                user: user._id,
                address: {
                    street: user.address[0].street1,
                    city: user.address[0].city,
                    zip: user.address[0].zip,
                },
                products: orderProducts.map((p) => p._id),
                totalPrice: +totalPrice.toFixed(2),
                status: statuses[rand(0, 2)],
            });
        }

        const insertedOrders = await Order.insertMany(ordersToCreate);
        console.log(`🛒 Inserted ${insertedOrders.length} orders`);

        for (const order of insertedOrders) {
            await User.findByIdAndUpdate(order.user, { $push: { orders: order._id } });
        }

        for (let i = 1; i < insertedUsers.length; i++) {
            const cartItems = pick(insertedProducts, 1, 3).map((p) => p._id);
            await User.findByIdAndUpdate(insertedUsers[i]._id, { $set: { carts: cartItems } });
        }
        console.log("🔗 Linked orders and carts to users");

        // ── Seed Featured Products ──
        const featuredProductIds = pick(insertedProducts, 8, 12).map((p) => p._id);
        await FeaturedProducts.create({
            products: featuredProductIds,
            featured: true,
        });
        console.log(`⭐ Marked ${featuredProductIds.length} products as featured`);

        // ── Summary ──
        console.log("\n" + "═".repeat(50));
        console.log("  🎉 DATABASE SEEDED SUCCESSFULLY!");
        console.log("═".repeat(50));
        console.log(`  Products:          ${insertedProducts.length}`);
        console.log(`  Users:             ${insertedUsers.length}`);
        console.log(`  Orders:            ${insertedOrders.length}`);
        console.log(`  Featured Products: ${featuredProductIds.length}`);
        console.log("═".repeat(50));
        console.log("\n🔑 Login credentials:");
        console.log("  Admin:  admin@ecommerce.com  /  Admin@1234");
        console.log("  User:   john@example.com     /  User@1234");
        console.log("═".repeat(50) + "\n");

        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        console.error(err);
        process.exit(1);
    }
}

seed();
