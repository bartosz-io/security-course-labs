import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly API = 'http://127.0.0.1:8080';
  @ViewChild('new', { static: true }) newProduct: ElementRef;
  products = [];
  searchTerm = '';

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadProducts();
    this.route.queryParams
      .subscribe(params => {
        this.searchTerm = params.search;
      });
  }

  loadProducts() {
    this.http.get(`${this.API}/products`)
      .subscribe((products: []) => this.products = products);
  }

  addProduct() {
    const product = {
      value: this.newProduct.nativeElement.value
    };
    this.http.post(`${this.API}/products`, product)
      .subscribe();
  }
}
