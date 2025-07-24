var commands = [];

function cmd(info, func) {
    var data = info;
    data.function = func;
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!data.desc) data.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!data.category) data.category = 'misc';
    if (!data.filename) data.filename = "Not Provided";
    commands.push(data);
    return data;
}

module.exports = {
    cmd,              // ✅ Primary export for command registration
    AddCommand: cmd,  // Optional aliases
    Function: cmd,
    Module: cmd,
    commands          // List of all registered commands
};
