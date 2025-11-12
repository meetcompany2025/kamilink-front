/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
   output: "standalone",

  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.app'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // ✅ Corrigido: agora temos apenas 1 bloco "experimental"
  // ✅  and habilitamos o  swc via WebAssembly -> compatível com todos sistemas operacionais 
   // Habilita cache inteligente e rotas dinâmicas no App Router
  experimental: {
    optimizePackageImports: ['lucide-react', '@rad   ix-ui/react-icons'],
    forceSwcTransforms: true, 
    serverActions: { bodySizeLimit: "2mb" },
    serverComponentsExternalPackages: ["@prisma/client"],
    // swcLoader: 'wasm',
  },

    dynamicParams: true,

      // Caso use API externa (como Koyeb), evite bloqueio de CORS no build SSR
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com", "your-cdn.com"],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextConfig;
