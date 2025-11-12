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
  experimental: {
    optimizePackageImports: ['lucide-react', '@rad   ix-ui/react-icons'],
    forceSwcTransforms: true, 
    // swcLoader: 'wasm',
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextConfig;
