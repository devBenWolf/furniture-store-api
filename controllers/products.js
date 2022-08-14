
const Products = require(`../models/product`)

const getAllProductsStatic = async(req, res) => {
    const {
        featured, 
        name, 
        company,
        sort,
        limit,
        skip,
    } = req.query
    const queryObject = {}
    if (company) {
        queryObject.company = {$regex: company, $options: 'i'}
    }
    if (name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    if (featured) {
        queryObject.featured = {$regex: featured, $options: 'i'}
    }


    let response = Products.find(queryObject)
    if (sort) {
        const sortSplit = sort.split(',').join(' ')
        response.sort(sortSplit)
    }
    if (limit) {
        response.limit(limit)
    }
    if (skip) {
        response.skip(skip)
    }
    const sortedProducts = await response
    res.status(200).json({sortedProducts})
}

const getAllProducts = async(req, res) => {
    const {
        featured, 
        name, 
        company,
        sort,
        limit,
        select,
        page,
        numericFilters,
    } = req.query
    const queryObject = {}
    // Basic search
    if (company) {
        queryObject.company = {$regex: company, $options: 'i'}
    }
    if (name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    if (featured) {
        queryObject.featured = {$regex: featured, $options: 'i'}
    }

    // numeric filter
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '<': '$lt',
            '<=': '$lte',
            '=': '$eq',
        }
        // convert symbols in query to mongoDB operators
        const regex = /\b(>|>=|<|<=|=)\b/g
        let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`)
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    let response = Products.find(queryObject)

    // product sort
    if (sort) {
        const sortSplit = sort.split(',').join(' ')
        response.sort(sortSplit)
    }

    // field select
    if (select) {
        const selectSplit = select.split(',').join(' ')
        response.select(selectSplit)
    }

    // pagination
    const requestedPage = Number(page) || 1
    const requestedLimit = Number(limit) || 10
    const skip =  (requestedPage - 1) * requestedLimit

    response.skip(skip).limit(requestedLimit)

    const sortedProducts = await response
    
    res.status(200).json({ hits: sortedProducts.length, sortedProducts})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}