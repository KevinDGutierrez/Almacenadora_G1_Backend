import Product from '../product/product-model.js'


export const existeProductById = async (uid = "") => {
    const existeProduct = await Product.findById(uid);
    
    if (!existeProduct) {
        throw new Error(`The product with id ${uid} does not exist in the database`);
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        const isLowStock = product.stock < product.minimumStock;

        return res.json({
            success: true,
            product,
            lowStockWarning: isLowStock,
            message: isLowStock ? "  Low stock, consider replenishing." : "Stock level is sufficient."
        });

    } catch (error) {
        console.error("Error getting product", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};

export const existeUsuarioById = async (id = "") => {
    const existeUsuario = await User.findById(id);
 
    if(!existeUsuario){
        throw new Error(`The id  ${id} does not exist in the database`)
    }
}