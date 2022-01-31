// [START snippet]

package main

import (
	"encoding/json"
	"fmt"

	"github.com/nitrictech/go-sdk/api/documents"
	"github.com/nitrictech/go-sdk/faas"
	"github.com/nitrictech/go-sdk/resources"
)

var (
	orders documents.CollectionRef
)

func handler(ctx *faas.HttpContext, next faas.HttpHandler) (*faas.HttpContext, error) {
	query := orders.Query()
	results, err := query.Fetch()
	if err != nil {
		return nil, err
	}

	docs := make([]map[string]interface{}, 0)

	for _, doc := range results.Documents {
		// handle documents
		docs = append(docs, doc.Content())
	}

	b, err := json.Marshal(docs)
	if err != nil {
		return nil, err
	}

	ctx.Response.Body = b
	ctx.Response.Headers["Content-Type"] = []string{"application/json"}

	return next(ctx)
}

func main() {
	var err error
	orders, err = resources.NewCollection("orders", resources.CollectionReading)
	if err != nil {
		panic(err)
	}
	mainApi := resources.NewApi("rest-api")

	err = mainApi.Get("/orders/", handler)
	if err != nil {
		fmt.Println(err)
	}
}

// [END snippet]
