import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { response } from 'express';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  ipoName: string = '';
  investment: number = 0;
  category: string = '';
  numPANs: number = 1;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  result: any = null;

  // List of IPO names (can be fetched from a server if needed)
  ipoSuggestions: string[] = [
    'Unimech Aerospace IPO',
    'Senores Pharmaceuticals IPO',
    'Ventive Hospitality IPO',
    'Carraro India IPO',
    'Mamata Machinery IPO',
    'Concord Enviro Systems IPO',
    'Sanathan Textiles IPO',
    'Newmalayalam Steel NSE SME',
    'Identical Brains Studios NSE SME',
    'DAM Capital Advisors IPO',
    'Transrail Lighting IPO'

  ];
  
  
  filteredSuggestions: string[] = [];

  onIpoNameInput() {
    // Filter suggestions based on input
    if (this.ipoName.trim() === '') {
      this.filteredSuggestions = [];
    } else {
      this.filteredSuggestions = this.ipoSuggestions.filter((ipo) =>
        ipo.toLowerCase().includes(this.ipoName.toLowerCase())
      );
    }
  }

  selectIpoName(suggestion: string) {
    this.ipoName = suggestion;
    this.filteredSuggestions = [];
  }

  async onSubmit() {
    this.isSubmitted = true;

    // Validate form fields
    if (!this.ipoName || this.investment <= 0 || !this.category || this.numPANs <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    this.isLoading = true;

    try {
      const response = await axios.post('http://localhost:3000/api/check-ipo', {
       // const response = await axios.post('/api/check-ipo', {
        ipoName: this.ipoName,
        investment: this.investment,
        category: this.category,
        numPANs: this.numPANs,
      });
      console.log("respinse is ",response)


      this.result = response.data.data;
    } catch (error) {
      console.error('Error fetching IPO data:', error);
      alert('Failed to fetch IPO data. Please try again later.');
    } finally {
      this.isLoading = false;
    }
  }

  // Dynamic styles for probability highlighting
  getProbabilityColor() {
    if (!this.result || !this.result.probability) return '#000';
    const probability = parseFloat(this.result.probability.replace('%', ''));
    if (probability > 75) return '#28a745'; // Green
    if (probability > 50) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  }

  getCreativePhrase(probability: number): string {
    if (probability === 1) {
      return "It’s like you applied for a jackpot... and won it! 🎉";
    } else if (probability >= 0.95) {
      return "Almost too good to be true—you’re nailing it! 🎯";
    } else if (probability >= 0.9) {
      return "Like blowing on a boulder and watching it move! 🪨✨";
    } else if (probability >= 0.8) {
      return "It’s like skipping stones and striking gold! 💎";
    } else if (probability >= 0.7) {
      return "You’re on a lucky streak—keep riding it! 🍀";
    } else if (probability >= 0.6) {
      return "A solid chance, like finding treasure on a hike! 🗺️";
    } else if (probability >= 0.5) {
      return "Halfway there—just one nudge could do it! 🤏";
    } else if (probability >= 0.4) {
      return "It’s like spotting a rainbow after a drizzle. 🌈";
    } else if (probability >= 0.3) {
      return "Feels like tossing a pebble and hearing it echo! 🎶";
    } else if (probability >= 0.2) {
      return "A small push might turn the tide—stay hopeful! 🌊";
    } else if (probability >= 0.15) {
      return "Like sowing seeds in barren land—magic might happen! 🌱✨";
    } else if (probability >= 0.1) {
      return "Barely there, but even the smallest spark can ignite a flame! 🔥";
    } else if (probability >= 0.08) {
      return "It’s like whispering to the stars—who knows what they’ll say? 🌌";
    } else if (probability >= 0.05) {
      return "It’s a shot in the dark, but you just might hit the mark! 🎯";
    } else if (probability >= 0.02) {
      return "Like trying to move mountains with a feather—believe in miracles! 🪶";
    } else if (probability > 0) {
      return "A dreamer's dream—sometimes that’s all it takes! 💭";
    } else {
      return "This one might not work, but the next adventure awaits! 🚀";
    }
  }
  
  
  
}
