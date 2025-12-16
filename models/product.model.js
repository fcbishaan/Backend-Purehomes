const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  price: { type: Number, required: true },
  oldPrice: Number,
  imgSrc: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  imgHover: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  isOnSale: { type: Boolean, default: false },
  salePercentage: String,
  inStock: { type: Boolean, default: true },
  hotSale: { type: Boolean, default: false },
  TodayDeal: { type: Boolean, default: false },
  filterSizes: [String],
  fabrics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fabric',
  }],
  colors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
  }],
  colorImages: [{
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
    imageUrl: String,
    public_id: String
  }],
  description: String,

  ratings: [
    {
      star: Number,
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],


  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug before saving
productSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Ensure slug uniqueness
    while (await mongoose.models.Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
  next();
});

// Virtual for product URL
productSchema.virtual('url').get(function () {
  return '/products/' + this.slug;
});

// Text index for search
productSchema.index({
  title: 'text',
  description: 'text',
});

module.exports = mongoose.model('Product', productSchema);
