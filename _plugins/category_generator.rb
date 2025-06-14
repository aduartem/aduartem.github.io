module Jekyll
  class CategoryPage < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)

      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      self.data['category'] = category
      self.data['title'] = "#{category}"

      normalized_category = category.to_s.downcase.gsub(' ', '-')
      self.data['permalink'] = "/category/#{normalized_category}/"

      @ext = '.html'
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category'
        dir = 'category'
        site.categories.keys.each do |category|
          # Normaliza la categoría para URL
          normalized_category = category.to_s.downcase.gsub(' ', '-')
          site.pages << CategoryPage.new(site, site.source, File.join(dir, normalized_category), category)
        end
      end
    end
  end
end