/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
  }, // устанавливаем конфигурацию для Webpack в Next.js. Тут выполняется добавление определенных библиотек в список внешних зависимостий (externals). Это означает, что при сборке проекта Webpack не будет пытаться включать их в собранный бандл JavaScript, а будет ожидать их наличие в среде выполнения Node.js. "commonjs" - это указание того, что библиотеку следует использовать как общий модуль при сборке (common), а не включать их в сборку приложения

  images: {
    domains: ["uploadthing.com", "utfs.io"],
  },
};

module.exports = nextConfig;
