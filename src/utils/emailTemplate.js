 const resetTemplates = ({userName,resetLink }) => {
    return`
     <div>
     <h1>${userName}</h1>
     <p>click to the reset your passowrd--> <a href=${resetLink}>Reset link</></p>
     </div
    `
}

module.exports = resetTemplates;