import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { response } from 'express';
import { isPlatformBrowser } from '@angular/common';
import { OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
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

  //List of IPO names (can be fetched from a server if needed)
  // ipoSuggestions: string[] = [
  //   'Unimech Aerospace IPO',
  //   'Citichem India SME',
  //   'Anya Polytech SME'
  // ];


  filteredSuggestions: string[] = [];
  statusData: any;
  performanceData: any;

  onIpoNameInput() {
    // Filter suggestions based on input
    if (this.ipoName.trim() === '') {
      this.filteredSuggestions = [];
    } else {
      this.filteredSuggestions = this.ipoSuggestions.filter((ipo: string) =>
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
      console.log("respinse is ", response)


      this.result = response.data.data;
    } catch (error) {
      console.error('Error fetching IPO data:', error);
      alert('Failed to fetch IPO data. Please try again later.');
    } finally {
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.fetchStatusAndPerformanceData();
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        this.scrollProgress = (winScroll / height) * 100;
      };

      window.addEventListener('scroll', this.scrollListener);
    }
    this.ipoNames()
  }

  async fetchStatusAndPerformanceData() {
    this.isLoading = true;
    try {
      const [statusResponse, performanceResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/status'),
        axios.get('http://localhost:3000/api/performance'),
      ]);
      this.statusData = statusResponse.data.data;
      this.performanceData = performanceResponse.data.data;
    } catch (error) {
      console.error('Error fetching status or performance data:', error);
      alert('Failed to fetch data. Please try again later.');
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

  getProbabilityNumber(): number {
    return parseFloat(this.result.probability.replace('%', ''));
  }
  
  getCreativePhrase(probability: number): string {
    if (probability === 100) {
      return "It’s like you applied for a jackpot... and won it! 🎉";
    } else if (probability >= 95) {
      return "Almost too good to be true—you’re nailing it! 🎯";
    } else if (probability >= 90) {
      return "Like blowing on a boulder and watching it move! 🪨✨";
    } else if (probability >= 80) {
      return "It’s like skipping stones and striking gold! 💎";
    } else if (probability >= 70) {
      return "You’re on a lucky streak—keep riding it! 🍀";
    } else if (probability >= 60) {
      return "A solid chance, like finding treasure on a hike! 🗺️";
    } else if (probability >= 50) {
      return "Halfway there—just one nudge could do it! 🤏";
    } else if (probability >= 40) {
      return "It’s like spotting a rainbow after a drizzle. 🌈";
    } else if (probability >= 30) {
      return "Feels like tossing a pebble and hearing it echo! 🎶";
    } else if (probability >= 20) {
      return "A small push might turn the tide—stay hopeful! 🌊";
    } else if (probability >= 15) {
      return "Like sowing seeds in barren land—magic might happen! 🌱✨";
    } else if (probability >= 10) {
      return "Barely there, but even the smallest spark can ignite a flame! 🔥";
    } else if (probability >= 8) {
      return "It’s like whispering to the stars—who knows what they’ll say? 🌌";
    } else if (probability >= 5) {
      return "It’s a shot in the dark, but you just might hit the mark! 🎯";
    } else if (probability >= 2) {
      return "Like trying to move mountains with a feather—believe in miracles! 🪶";
    } else if (probability > 0) {
      return "A dreamer's dream—sometimes that’s all it takes! 💭";
    } else {
      return "This one might not work, but the next adventure awaits! 🚀";
    }
  }
  

  scrollProgress = 0;
  showNotification = true;
  private scrollListener: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('IPO Insights - Your trusted partner for IPO investments');
    this.metaService.updateTag({ name: 'description', content: 'Detailed analysis of IPO investments' });
  }
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  
  }
 

  closeNotification() {
    this.showNotification = false;
  }

  ipoSuggestions: any
  async ipoNames() {
    try {

      const response = await axios.get("http://localhost:3000/api/suggestions")
      console.log("reponse of ipo name is comnig as", response.data.data)
      this.ipoSuggestions = response.data.data

    } catch (error) {
      console.log("error for ipo name is coming as", error)
    }
  }


}
