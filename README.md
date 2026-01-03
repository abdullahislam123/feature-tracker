# Feature Tracker 🚀

**Feature Tracker** aik smart aur automated progress management tool hai jo khas taur par VS Code developers ke liye banaya gaya hai. Yeh tool aapko implement kiye gaye features ko track karne mein madad deta hai taake aapka focus coding par rahay, manual documentation par nahi.

---

## ✨ Key Features

### 🧠 Smart Cursor-Out Automation
Ab har keystroke par feature add hone ka masla khatam! 
* **Focus Detection**: Yeh extension tab trigger hoti hai jab aap kisi `div` ki class likhte hain.
* **Exit-Trigger Logic**: Naya feature sirf tabhi list mein add hota hai jab aapka cursor class name (quotes) se bahar nikalta hai.
* **Zero Keystroke Noise**: Adhoore naam add nahi honge; sirf finalized aur mukammal class names hi sidebar mein jayenge.

### 🛠️ Manual & Smart Management
* **Manual Add**: `+` icon par click kar ke kisi bhi waqt custom feature add karain.
* **Inline Actions**: Har item ke sath mojood buttons se **Edit** ya **Delete** karain.
* **Persistent Storage**: Aapka sara data **Workspace State** mein save rehta hai, yani VS Code restart karne par bhi data mehfooz rehta hai.

### ⚡ Performance Optimized
* **Selection-Based Trigger**: Yeh har waqt file ko scan nahi karta, balkay sirf cursor move hone par kaam karta hai taake editor slow na ho.

---

## 📖 How to Use

1. **Automation**: Kisi bhi HTML/React file mein `<div class="login-box">` likhain. Jaise hi aap cursor ko quotes se bahar move karenge, sidebar mein "Div: login-box" add ho jayega.
2. **Manual Tracking**: Activity Bar mein **Rocket Icon** par click karain aur manually features add karain.
3. **Management**: Sidebar mein kisi bhi feature par hover karain aur **Pencil** (Edit) ya **Trash** (Delete) icon use karain.

---

## 📦 Installation

Aap isay marketplace se ya `.vsix` file ke zariye install kar sakte hain:
1. Terminal mein `vsce package --allow-missing-repository` chala kar bundle banayein.
2. VS Code mein **Extensions > ... > Install from VSIX...** select karain.

> **Note**: Behtar results ke liye hamesha latest version (0.1.2) use karain.

---

## 📄 License
This extension is licensed under the **MIT License**.