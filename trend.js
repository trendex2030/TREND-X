var commands = [];

function ven(info, func) {
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
    cmd: ven,             // ✅ Allow importing with: const { cmd } = require('./trend')
    ven,
    AddCommand: ven,
    Function: ven,
    Module: ven,
    commands,
};
