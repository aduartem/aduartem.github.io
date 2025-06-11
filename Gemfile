source "https://rubygems.org"

# Usar Jekyll directamente en lugar de github-pages para mayor flexibilidad
gem "jekyll", "~> 4.2.2"

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jemoji"
  gem "jekyll-seo-tag", "~> 2.7"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
gem "webrick"