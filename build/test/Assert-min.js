APE.namespace("APE.test").mixin(new function(){this.Assert=C;this.assert=C;this.fail=A;function C(H,G,F){var D;try{D=G(H)}catch(E){throw new Error("constraint could not complete. ")}if(D){throw new B(D,F)}}function A(D){throw new B(D||"Test force-failed.")}function B(E,D){this.message=E+(D?"; "+D:"");this.name="AssertionError"}});