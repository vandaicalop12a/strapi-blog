const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
      .replace(/[\s_-]+/g, '-') // Thay thế khoảng trắng/underscore bằng dấu gạch ngang
      .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu/cuối
  
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.name) {
      let slug = slugify(data.name);
      let counter = 1;
      // Kiểm tra trùng lặp và thêm số nếu cần
      while (true) {
        const existingTag = await strapi.db.query('api::tag.tag').findOne({
          where: { slug },
        });
        if (!existingTag) break;
        slug = `${slugify(data.name)}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.name) {
      // Lấy bài tag hiện tại để kiểm tra name cũ
      const existingTag = await strapi.entityService.findOne(
        'api::tag.tag',
        where.id,
        { fields: ['name'] }
      );

      // Chỉ cập nhật slug nếu name thay đổi
      if (existingTag.name !== data.name) {
        let slug = slugify(data.name);
        let counter = 1;
        while (true) {
          const existingSlug = await strapi.db.query('api::tag.tag').findOne({
            where: { slug },
          });
          if (!existingSlug) break;
          slug = `${slugify(data.name)}-${counter}`;
          counter++;
        }
        data.slug = slug;
      }
    }
  },
};