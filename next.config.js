// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Google
      'encrypted-tbn0.gstatic.com',

      // MoMo
      'cinema.momocdn.net',

      // CGV, Metiz, StarLight
      'cgvdt.vn',
      'metiz.vn',
      'starlight.vn',

      // IMP Awards, TMDB, Elleman
      'www.impawards.com',
      'www.themoviedb.org',
      'www.elleman.vn',

      // Firstpost, Reddit, Wix
      'images.firstpost.com',
      'preview.redd.it',
      'images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com',

      // Khenphim, brvn.vn
      'khenphim.com',
      'cdn.brvn.vn',

      // Baotintuc, VCDN
      'cdnmedia.baotintuc.vn',
      'iguov8nhvyobj.vcdn.cloud',

      // Fallback nếu bạn dùng imgur hoặc upload sau này
      'i.imgur.com',

      'vb.1cdn.vn',
      'images.unsplash.com',
      'storage.googleapis.com',
      'www.googleapis.com',
      'images.pexels.com',

     'firebasestorage.googleapis.com', 
     'storage.googleapis.com',
     'image.tmdb.org',
     'i.ytimg.com'
    ]
  }
}

module.exports = nextConfig
