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
    if (data.title) {
      let slug = slugify(data.title);
      let counter = 1;
      // Kiểm tra trùng lặp và thêm số nếu cần
      while (true) {
        const existingPost = await strapi.db.query('api::post.post').findOne({
          where: { slug },
        });
        if (!existingPost) break;
        slug = `${slugify(data.title)}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.title) {
      // Lấy bài post hiện tại để kiểm tra title cũ
      const existingPost = await strapi.entityService.findOne(
        'api::post.post',
        where.id,
        { fields: ['title'] }
      );

      // Chỉ cập nhật slug nếu title thay đổi
      if (existingPost.title !== data.title) {
        let slug = slugify(data.title);
        let counter = 1;
        while (true) {
          const existingSlug = await strapi.db.query('api::post.post').findOne({
            where: { slug },
          });
          if (!existingSlug) break;
          slug = `${slugify(data.title)}-${counter}`;
          counter++;
        }
        data.slug = slug;
      }
    }
  },
};