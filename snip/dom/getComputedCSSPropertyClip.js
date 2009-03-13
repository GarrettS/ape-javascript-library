                if(p == "clip") {
                    temp = cs[getPropertyCSSValue];

                    // Support for implementation of getPropertyCSSValue.
                    if(temp && (temp = cs[getPropertyCSSValue](p)) && (temp.getRectValue) 
                        && (temp = temp.getRectValue()) && temp.top && temp.top[cssText]) {
                        value = {
                            top:temp.top[cssText],
                            right:temp.right[cssText],
                            bottom:temp.bottom[cssText],
                            left:temp.left[cssText],
                        };
                        
                            // Fix for missing cssText in FF.
                        value.toString = function(){ 
                            return"rect(" + value.top + ", " + value.right +
                                 ", " + value.bottom +", " + value.left+")";
                        };
                    };
                }
