export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.findOne(filter).select(select).populate(populate);
};

export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  sort = {},
  skip = 0,
  limit = 0,
} = {}) => {
  const [data, total] = await Promise.all([
    model
      .find(filter)
      .select(select)
      .populate(populate)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    model.countDocuments(filter),
  ]);

  return { data, total };
};

export const count = async ({ model, filter = {} } = {}) => {
  return await model.countDocuments(filter);
};

export const findById = async ({
  model,
  id,
  select = "",
  populate = [],
} = {}) => {
  return await model.findById(id).select(select).populate(populate);
};

export const create = async ({
  model,
  data = [{}],
  options = { validateBeforeSave: true },
} = {}) => {
  return await model.create(data, options);
};

const hasOperators = (data = {}) =>
  Object.keys(data).some((key) => key.startsWith("$"));

export const updateOne = async ({
  model,
  filter,
  data = {},
  options = { runValidators: true },
} = {}) => {
  const updateData = hasOperators(data) ? data : { $set: data };
  return await model.updateOne(filter, updateData, options);
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  options = { runValidators: true, new: true },
  select = "",
  populate = [],
} = {}) => {
  const updateData = hasOperators(data)
    ? { ...data, $inc: { ...(data.$inc || {}), __v: 1 } }
    : { $set: data, $inc: { __v: 1 } };

  return await model
    .findOneAndUpdate(filter, updateData, options)
    .select(select)
    .populate(populate);
};

export const findOneAndDelete = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.findOneAndDelete(filter).select(select).populate(populate);
};

export const deleteOne = async ({ model, filter = {} } = {}) => {
  return await model.deleteOne(filter);
};

export const deleteMany = async ({ model, filter = {} } = {}) => {
  return await model.deleteMany(filter);
};
