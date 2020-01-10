class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // remove page, limit, fields and sort fields from req.query
    let queryObj = { ...this.queryString };
    const features = ['limit', 'sort', 'page', 'fields'];
    features.forEach(el => {
      delete queryObj[el];
    });

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const pageSize = this.queryString.limit * 1 || 100;

    // page = 2, pageSize = 5
    // page 1: 1-5,
    // page 2: 6-10,
    // page 3: 11-15

    const skip = (page - 1) * pageSize;
    this.query = this.query.skip(skip).limit(pageSize);
  }
}

module.exports = ApiFeatures;
