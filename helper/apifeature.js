class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search;

      // Get all fields from the model's schema
      const searchFields = Object.keys(this.query.model.schema.paths);

      // Create conditions for each field
      const orConditions = searchFields
        .map((field) => {
          // Exclude fields that are not strings or numbers
          const fieldType = this.query.model.schema.paths[field].instance;
          if (fieldType === "String" || fieldType === "Number") {
            return { [field]: { $regex: searchQuery, $options: "i" } };
          }
          return null;
        })
        .filter((condition) => condition !== null);

      if (orConditions.length > 0) {
        this.query = this.query.or(orConditions);
      }
    }
    return this;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
