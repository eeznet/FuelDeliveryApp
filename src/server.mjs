// Dynamic imports for routes
const loadRoutes = async () => {
    try {
        const authRoutes = (await import('./routes/authRoutes.js')).default;
        const userRoutes = (await import('./routes/userRoutes.js')).default;
        const invoiceRoutes = (await import('./routes/invoiceRoutes.js')).default;

        // Apply routes
        app.use("/api/auth", authRoutes);
        app.use("/api/user", userRoutes);
        app.use("/api/invoice", invoiceRoutes);

        console.log('✅ Routes loaded successfully');
    } catch (error) {
        console.error('❌ Error loading routes:', error);
        throw error;
    }
}; 