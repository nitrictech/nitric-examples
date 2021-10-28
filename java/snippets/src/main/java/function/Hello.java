// [START snippet]

package function;

import io.nitric.faas.Faas;
import io.nitric.faas.http.HttpContext;

public class Hello {

    public static void main(String[] args) {
        new Faas()
            .http(context -> {
        		ctx.getResponse().text("Hello World!");
        		return ctx;
			})
            .start();
    }
}

// [END snippet]