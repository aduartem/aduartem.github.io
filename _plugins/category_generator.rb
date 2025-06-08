module Jekyll
  class CategoryPage < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'  # Esto está bien, pero necesitamos corregir otras cosas

      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      self.data['category'] = category
      self.data['title'] = "Categoría: #{category}"

      # Definir explícitamente la extensión del archivo y el conversor
      @ext = '.html'
      @path = File.join(@base, @dir, 'index.html')
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category'
        dir = 'category'
        site.categories.keys.each do |category|
          # Simplificar esta línea para evitar problemas con nil
          category_dir = File.join(dir, category.to_s.downcase.gsub(' ', '-'))
          site.pages << CategoryPage.new(site, site.source, category_dir, category)
        end
      end
    end
  end
end