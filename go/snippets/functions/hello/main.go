// [START snippet]

package main

import (
	"fmt"

	"github.com/nitrictech/go-sdk/faas"
)

func handler(ctx *faas.HttpContext) (*faas.HttpContext, error) {
	ctx.Response.Body = []byte("Hello World!")

	return ctx, nil
}

func main() {
	err := faas.New().Http(
		handler,
	).Start()

	if err != nil {
		fmt.Println(err)
	}
}

// [END snippet]
