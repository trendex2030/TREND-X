const commands = [];

function ven(options, handler) {
    if (typeof options === 'object' && typeof handler === 'function') {
        // Command-style registration
        const command = {
            pattern: options.pattern || null,
            alias: options.alias || [],
            desc: options.desc || '',
            category: options.category || 'misc',
            react: options.react || null,
            filename: options.filename || '',
            use: options.use || '',
            function: handler,
            on: options.on || null
        };
        commands.push(command);
    } else if (typeof options === 'object' && options.on) {
        // Event-style registration (like "body", "text", etc.)
        const event = {
            on: options.on,
            function: handler || options.function
        };
        commands.push(event);
    }
}

module.exports = {
    ven,
    commands
};
