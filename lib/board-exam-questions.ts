import { Question } from './types';

export interface QuestionTemplate {
  question: string;
  answer: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const generateBoardExamQuestions = (topicName: string, count: number, difficulty: 'easy' | 'medium' | 'hard'): QuestionTemplate[] => {
  const templates = getBoardExamTemplates(topicName, difficulty);
  return templates.slice(0, Math.min(count, templates.length));
};

function getBoardExamTemplates(topicName: string, difficulty: 'easy' | 'medium' | 'hard'): QuestionTemplate[] {
  const templates: QuestionTemplate[] = [];

  if (difficulty === 'easy') {
    templates.push(
      {
        question: `A network administrator is troubleshooting connectivity issues in a ${topicName} environment. After running diagnostic commands, the administrator notices that packets are being forwarded but with increased latency. Which of the following is the MOST likely cause of this behavior?`,
        answer: 'B',
        options: [
          'Network interface card driver incompatibility causing packet processing delays',
          'Suboptimal routing path resulting in additional router hops',
          'Insufficient bandwidth allocation on the primary link',
          'DNS resolution failures creating timeout conditions',
          'MAC address table overflow on the core switch'
        ],
        correctAnswer: 'B',
        explanation: 'Suboptimal routing creates additional hops, increasing latency while maintaining connectivity. The other options would typically cause packet loss or complete failure rather than just increased latency.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `In a ${topicName} implementation, an engineer must ensure data integrity during transmission across an untrusted network segment. The solution must provide both encryption and authentication while maintaining compatibility with existing infrastructure. Which protocol combination would BEST meet these requirements?`,
        answer: 'C',
        options: [
          'SSL with SHA-1 hashing for backward compatibility',
          'TLS 1.0 with MD5 message authentication',
          'IPsec with AES-256 encryption and SHA-256 HMAC',
          'WPA2 with TKIP encryption protocol',
          'SSH with 3DES encryption and RSA authentication'
        ],
        correctAnswer: 'C',
        explanation: 'IPsec with AES-256 and SHA-256 HMAC provides strong encryption and authentication suitable for untrusted networks. SSL/TLS 1.0 with SHA-1/MD5 are deprecated, WPA2 is for wireless, and SSH with 3DES uses weaker encryption.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `A company is experiencing intermittent connectivity issues with ${topicName}. Network monitoring shows that the issue occurs during peak business hours but resolves during off-peak times. Bandwidth utilization graphs indicate 85% capacity during problem periods. What is the MOST appropriate initial troubleshooting step?`,
        answer: 'D',
        options: [
          'Immediately upgrade all network links to higher bandwidth capacity',
          'Implement aggressive packet filtering to reduce overall traffic volume',
          'Replace all network switches with higher-performance models',
          'Analyze traffic patterns to identify bandwidth-intensive applications',
          'Disable all non-essential network services during business hours'
        ],
        correctAnswer: 'D',
        explanation: 'Analyzing traffic patterns identifies the root cause before implementing solutions. Upgrading infrastructure without analysis is costly and may not address the actual problem. The other options are reactive rather than diagnostic.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `An organization implementing ${topicName} needs to segment network traffic between departments while maintaining a single physical infrastructure. Each department requires isolation from others but must access shared resources in the data center. Which technology would BEST accomplish this requirement?`,
        answer: 'C',
        options: [
          'Implement separate physical switches for each department with trunk links to the data center',
          'Configure port-based access control lists on every switch port',
          'Deploy VLANs with inter-VLAN routing through a Layer 3 switch or router',
          'Use MAC address filtering to control traffic between departments',
          'Install separate network cables for each department through different conduits'
        ],
        correctAnswer: 'C',
        explanation: 'VLANs provide logical segmentation on shared infrastructure with inter-VLAN routing for controlled access to shared resources. Physical separation is costly and inflexible, ACLs alone do not provide segmentation, MAC filtering is easily bypassed, and separate cabling is impractical.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `During ${topicName} configuration, a technician observes that end devices are receiving IP addresses in the 169.254.x.x range instead of addresses from the intended subnet. What is the MOST likely cause of this issue?`,
        answer: 'A',
        options: [
          'DHCP server is unreachable or not responding to client requests',
          'Default gateway is configured incorrectly on the DHCP server',
          'DNS server addresses are missing from the DHCP scope',
          'Subnet mask is configured as 255.255.255.0 instead of 255.255.0.0',
          'Network Time Protocol synchronization has failed'
        ],
        correctAnswer: 'A',
        explanation: '169.254.x.x addresses indicate APIPA (Automatic Private IP Addressing), which occurs when a DHCP client cannot reach a DHCP server. Gateway misconfiguration, missing DNS, subnet mask issues, and NTP problems would not trigger APIPA.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `A network engineer configuring ${topicName} must ensure that critical voice traffic receives priority over data traffic during periods of congestion. The solution must work across multiple vendor devices. Which standardized approach should be implemented?`,
        answer: 'B',
        options: [
          'Configure proprietary QoS mechanisms specific to each vendor platform',
          'Implement DSCP marking with consistent class-based queuing policies',
          'Increase bandwidth on all links to eliminate congestion',
          'Use VLAN priority tagging exclusively for traffic classification',
          'Deploy separate physical networks for voice and data traffic'
        ],
        correctAnswer: 'B',
        explanation: 'DSCP (Differentiated Services Code Point) is a standardized Layer 3 QoS mechanism that works across vendors. Proprietary mechanisms lack interoperability, bandwidth increases are costly, VLAN tagging alone is Layer 2 only, and separate networks are inefficient.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `While implementing ${topicName}, an administrator discovers that certain applications fail when traversing the network, while others work correctly. Packet analysis reveals that packets larger than 1500 bytes are being dropped. What is the MOST appropriate solution?`,
        answer: 'D',
        options: [
          'Increase the MTU size on all network devices to 9000 bytes',
          'Disable all applications that generate packets larger than 1500 bytes',
          'Configure all routers to fragment packets automatically',
          'Enable Path MTU Discovery and configure appropriate MSS values',
          'Replace all network equipment with devices supporting jumbo frames'
        ],
        correctAnswer: 'D',
        explanation: 'Path MTU Discovery allows devices to determine the maximum transmission size along a path, and MSS (Maximum Segment Size) adjustment prevents fragmentation. Increasing MTU requires end-to-end support, disabling applications is not practical, fragmentation reduces performance, and equipment replacement is costly.',
        type: 'multiple-choice',
        difficulty: 'easy'
      },
      {
        question: `An organization's ${topicName} deployment requires redundant connections between distribution and access layer switches. The design must prevent Layer 2 loops while allowing all links to actively forward traffic. Which protocol combination would BEST meet these requirements?`,
        answer: 'E',
        options: [
          'Spanning Tree Protocol with PortFast on all access ports',
          'Rapid Spanning Tree Protocol with root bridge priority configuration',
          'Multiple Spanning Tree Protocol with separate instances per VLAN',
          'VLAN Trunking Protocol with transparent mode configuration',
          'Link Aggregation Protocol with LACP for active-active redundancy'
        ],
        correctAnswer: 'E',
        explanation: 'Link Aggregation with LACP allows multiple links to forward traffic simultaneously while preventing loops. STP variants block redundant links rather than using them, and VTP is for VLAN management not loop prevention.',
        type: 'multiple-choice',
        difficulty: 'easy'
      }
    );
  }

  if (difficulty === 'medium') {
    templates.push(
      {
        question: `A network architect is designing a ${topicName} solution for a multi-site enterprise deployment. The design must support automatic failover, load distribution, and maintain session persistence for critical applications. The organization has budget constraints that limit hardware redundancy to two devices per site.\n\nGiven these constraints, which architecture would provide the OPTIMAL balance between high availability and cost efficiency?`,
        answer: 'A',
        options: [
          'Active-active configuration with VRRP for gateway redundancy and session state synchronization',
          'Active-passive configuration with HSRP and manual failover procedures',
          'Load balancing with round-robin DNS and client-side connection retry logic',
          'Clustered configuration with shared storage and heartbeat monitoring',
          'Active-active configuration with GLBP and stateless application design'
        ],
        correctAnswer: 'A',
        explanation: 'Active-active with VRRP provides both load distribution and automatic failover while maintaining session state, meeting all requirements with only two devices. HSRP active-passive wastes resources, DNS round-robin lacks true failover, clustering requires additional infrastructure, and GLBP with stateless design does not maintain session persistence.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `An organization implementing ${topicName} has discovered that certain network segments are experiencing asymmetric routing, where inbound and outbound traffic traverse different paths. Security policies require stateful inspection of all traffic flows.\n\nWhich approach would BEST resolve this issue while maintaining security requirements?`,
        answer: 'C',
        options: [
          'Configure policy-based routing to force symmetric paths through a single firewall',
          'Implement stateless packet filtering on all network boundaries',
          'Deploy stateful firewalls in active-active mode with connection state synchronization',
          'Disable routing protocols and use static routes exclusively',
          'Configure NAT on all internal network segments to normalize traffic flow'
        ],
        correctAnswer: 'C',
        explanation: 'Active-active firewalls with state synchronization handle asymmetric routing while maintaining stateful inspection. PBR may not cover all scenarios, stateless filtering violates requirements, static routes are not scalable, and NAT does not address the asymmetric routing issue.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `During a ${topicName} migration, a network team observes that certain applications experience timeout errors while others function normally. Packet captures reveal that affected applications use TCP window scaling and selective acknowledgments. Legacy network devices in the path do not recognize these TCP options.\n\nWhat is the MOST effective solution that maintains optimal performance for modern applications?`,
        answer: 'B',
        options: [
          'Globally disable TCP window scaling and selective acknowledgments on all endpoints',
          'Replace legacy devices with equipment supporting RFC-compliant TCP option handling',
          'Configure TCP option stripping on edge routers to normalize all traffic',
          'Implement application-layer gateways to translate between TCP versions',
          'Reduce MTU size across the network to avoid triggering advanced TCP features'
        ],
        correctAnswer: 'B',
        explanation: 'Replacing non-compliant devices ensures proper TCP operation and optimal performance. Disabling TCP features globally degrades performance, option stripping breaks functionality, ALGs add complexity and latency, and reducing MTU does not address the TCP option issue.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `A security audit of a ${topicName} infrastructure reveals that administrative access is currently protected only by username and password authentication. Compliance requirements mandate multi-factor authentication for all privileged access. The solution must work with existing RADIUS infrastructure and support emergency access procedures.\n\nWhich implementation would BEST satisfy these requirements?`,
        answer: 'D',
        options: [
          'Implement certificate-based authentication with hardware tokens for all administrators',
          'Deploy biometric scanners at all network operation center locations',
          'Configure TACACS+ with one-time password generation via SMS',
          'Integrate RADIUS with time-based one-time password (TOTP) tokens and emergency bypass codes',
          'Require VPN connection with IPsec certificate authentication before administrative access'
        ],
        correctAnswer: 'D',
        explanation: 'RADIUS with TOTP provides MFA while maintaining existing infrastructure and includes emergency bypass capability. Certificates alone do not provide MFA, biometrics require physical presence, TACACS+ requires infrastructure changes, and VPN adds unnecessary complexity for local access.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `A company deploying ${topicName} across multiple branch offices experiences issues where remote sites cannot communicate with each other, but all sites can reach the headquarters. Investigation reveals:\n- Hub-and-spoke VPN topology\n- All tunnels terminate at headquarters\n- Dynamic routing protocol enabled\n- Split tunneling disabled\n- Encryption domain includes all subnets\n\nWhich configuration change would enable direct branch-to-branch communication while maintaining security?`,
        answer: 'B',
        options: [
          'Enable split tunneling on all remote sites to allow direct Internet routing',
          'Implement dynamic multipoint VPN with spoke-to-spoke tunnels',
          'Configure static routes at headquarters to hairpin traffic between branches',
          'Deploy full mesh VPN topology with tunnels between all sites',
          'Enable proxy ARP on the headquarters firewall for inter-branch traffic'
        ],
        correctAnswer: 'B',
        explanation: 'DMVPN allows dynamic spoke-to-spoke tunnels while maintaining hub control. Split tunneling bypasses security, hairpinning is inefficient, full mesh is complex to manage, and proxy ARP does not work across VPN tunnels.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `During ${topicName} troubleshooting, an engineer discovers that TCP connections are establishing successfully but file transfers fail after transferring approximately 1MB of data. The issue affects only certain client-server pairs. Analysis shows:\n- Three-way handshake completes normally\n- Initial data transfer succeeds\n- Connection resets after specific data volume\n- Ping and UDP traffic work without issues\n- Problem occurs regardless of application\n\nWhat is the MOST likely root cause?`,
        answer: 'C',
        options: [
          'TCP window size negotiation failure causing flow control issues',
          'Application-layer timeout settings configured too aggressively',
          'Intermediate firewall with connection tracking table exhaustion',
          'Network device dropping packets due to TCP sequence number validation',
          'Asymmetric routing causing stateful firewall to drop return traffic'
        ],
        correctAnswer: 'C',
        explanation: 'Connection tracking table exhaustion causes established connections to be reset after the table entry expires, typically after a specific amount of data or time. Window size issues would cause slowdowns not resets, application timeouts would not be consistent across applications, sequence validation would fail immediately, and asymmetric routing would prevent initial establishment.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `An organization implementing ${topicName} must support 500 VLANs across a campus network with 50 distribution switches. The current Spanning Tree Protocol implementation shows convergence times of 30-50 seconds during topology changes, causing unacceptable application disruptions.\n\nWhich combination of technologies would provide the FASTEST convergence while maintaining scalability?`,
        answer: 'E',
        options: [
          'Upgrade to Rapid Spanning Tree Protocol with BackboneFast and UplinkFast',
          'Implement Per-VLAN Spanning Tree with root bridge per VLAN distribution',
          'Deploy Multiple Spanning Tree Protocol with optimized region configuration',
          'Configure PortFast on all access ports and enable BPDU Guard globally',
          'Implement MST with reduced number of instances and enable RSTP enhancements'
        ],
        correctAnswer: 'E',
        explanation: 'MST with reduced instances provides scalability for many VLANs while RSTP enhancements ensure fast convergence. Standard RSTP alone still has convergence delays, PVST creates 500 instances which is not scalable, PortFast only helps access ports not topology changes, and MST without RSTP enhancements does not optimize convergence.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `A network running ${topicName} experiences periodic outages where all network services become unavailable for 2-3 minutes before recovering. Logs show:\n- No hardware failures detected\n- CPU utilization spikes to 100% during outages\n- Routing table shows route flapping\n- Interface counters show no errors\n- Issue correlates with routing protocol updates\n\nWhat is the MOST likely cause and appropriate solution?`,
        answer: 'A',
        options: [
          'Route redistribution causing routing loops; implement route filtering and administrative distance adjustment',
          'Insufficient router memory; upgrade hardware to support larger routing tables',
          'Broadcast storm; enable storm control on all switch interfaces',
          'Routing protocol authentication mismatch; verify and correct authentication keys',
          'Duplex mismatch on uplink interfaces; configure auto-negotiation on all links'
        ],
        correctAnswer: 'A',
        explanation: 'Route redistribution without proper filtering can cause routing loops and route flapping, leading to CPU spikes during reconvergence. Memory issues would cause crashes not recovery, broadcast storms would show interface errors, authentication mismatch would prevent adjacency formation, and duplex mismatch would show CRC errors.',
        type: 'multiple-choice',
        difficulty: 'medium'
      },
      {
        question: `An enterprise deploying ${topicName} requires wireless access for 2000 concurrent users across a campus. Requirements include:\n- Seamless roaming between access points\n- Centralized authentication and policy enforcement\n- Guest access with captive portal\n- Bandwidth guarantee for voice clients\n- Compliance with regulatory power limits\n\nWhich architecture would BEST meet all requirements?`,
        answer: 'C',
        options: [
          'Autonomous access points with local RADIUS servers and manual RF planning',
          'Controller-based architecture with local mode APs and FlexConnect for remote sites',
          'Centralized wireless controller with lightweight APs and 802.11k/v/r for roaming optimization',
          'Cloud-managed access points with distributed forwarding and local switching',
          'Mesh network topology with root APs and wireless backhaul connections'
        ],
        correctAnswer: 'C',
        explanation: 'Centralized controller with lightweight APs provides centralized management, authentication, and policy enforcement. 802.11k/v/r standards enable optimized roaming. Autonomous APs lack centralized control, FlexConnect is for remote sites not campus, cloud-managed may have latency issues for real-time roaming, and mesh is for coverage extension not high-density deployments.',
        type: 'multiple-choice',
        difficulty: 'medium'
      }
    );
  }

  if (difficulty === 'hard') {
    templates.push(
      {
        question: `A global enterprise is implementing ${topicName} across multiple data centers with the following requirements:\n- Sub-second failover for critical applications\n- Consistent routing policies across all sites\n- Support for both IPv4 and IPv6 dual-stack\n- Compliance with regional data sovereignty regulations\n- Minimal impact on existing MPLS infrastructure\n\nThe network team has identified that current IGP convergence times exceed acceptable thresholds during link failures. Which combination of technologies would BEST address all requirements while minimizing infrastructure changes?`,
        answer: 'E',
        options: [
          'Implement OSPF with BFD for fast failure detection and route redistribution with route maps for policy consistency',
          'Deploy IS-IS with aggressive timers and BGP confederations for inter-site routing with local preference manipulation',
          'Configure EIGRP with feasible successors and distribute-lists for policy enforcement with VRF-lite for data separation',
          'Utilize BGP with fast external failover and AS path prepending for traffic engineering with GRE tunnels for IPv6',
          'Deploy MP-BGP with BFD for sub-second detection, route-target filtering for sovereignty, and existing MPLS for transport'
        ],
        correctAnswer: 'E',
        explanation: 'MP-BGP with BFD provides sub-second failover, supports dual-stack natively, uses route-targets for data sovereignty, and leverages existing MPLS infrastructure. OSPF/IS-IS are IGPs with slower convergence, EIGRP is Cisco-proprietary, and GRE tunnels add unnecessary overhead when MPLS is available.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `A financial institution's ${topicName} deployment must support high-frequency trading applications requiring microsecond-level latency consistency. Current monitoring shows latency variance (jitter) of 5-15ms during market hours. Analysis reveals the following:\n- Average packet size: 512 bytes\n- Link utilization: 45% during peak\n- Queue depth: 100 packets\n- Scheduling: FIFO on all interfaces\n- Multiple traffic classes sharing links\n\nWhich combination of QoS mechanisms would provide the MOST significant improvement in latency consistency for trading traffic?`,
        answer: 'C',
        options: [
          'Implement strict priority queuing for trading traffic with WRED for congestion avoidance on lower-priority classes',
          'Configure class-based weighted fair queuing with increased bandwidth allocation and traffic shaping',
          'Deploy low-latency queuing with reduced queue depth, strict priority for trading, and policer-based admission control',
          'Enable CBWFQ with DSCP marking and TCP optimization for trading applications',
          'Implement hierarchical QoS with parent shaping policy and child LLQ with increased link bandwidth'
        ],
        correctAnswer: 'C',
        explanation: 'LLQ with reduced queue depth minimizes queuing delay, strict priority ensures immediate forwarding, and policing prevents queue buildup. WRED is for TCP traffic, CBWFQ alone does not provide strict priority, DSCP marking without proper queuing does not reduce jitter, and hierarchical QoS adds complexity without addressing the core issue of queue depth.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `During a ${topicName} security assessment, penetration testers successfully exploited a vulnerability by sending specially crafted packets that caused control plane CPU utilization to spike to 100%, resulting in routing protocol adjacency failures and network instability.\n\nPost-incident analysis reveals:\n- Attack traffic: 50,000 pps of malformed ICMP packets\n- Legitimate traffic: 200,000 pps average\n- Control plane protocols: BGP, OSPF, HSRP, NTP, SSH\n- Current protection: Interface ACLs only\n\nWhich multi-layered approach would provide the MOST comprehensive protection against similar attacks while maintaining operational functionality?`,
        answer: 'A',
        options: [
          'Implement CoPP with rate-limiting for ICMP, class-based policing for control protocols, and hardware-based ACLs for known attack patterns',
          'Deploy dedicated out-of-band management network and disable all control plane protocols on production interfaces',
          'Configure aggressive ICMP rate-limiting globally and implement uRPF strict mode on all interfaces',
          'Enable TCP intercept for all control plane protocols and implement connection limits per source IP',
          'Deploy inline IPS appliances with signature-based detection and automatic blacklisting of attack sources'
        ],
        correctAnswer: 'A',
        explanation: 'CoPP provides granular control plane protection with rate-limiting for ICMP while allowing legitimate traffic, class-based policing protects routing protocols, and hardware ACLs offload processing. Out-of-band management does not protect the data plane, global ICMP limiting affects legitimate traffic, TCP intercept does not apply to ICMP/UDP protocols, and IPS adds latency and single point of failure.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `A service provider implementing ${topicName} for enterprise customers must design a solution that provides:\n- Layer 2 connectivity between customer sites\n- Isolation between different customers\n- Support for customer-specific VLAN IDs\n- Scalability to 500+ customer VPNs\n- Efficient use of provider network resources\n\nThe provider's core network runs MPLS with LDP. Customer edge devices have limited MPLS capability. Which architecture would BEST meet all requirements while optimizing provider network efficiency?`,
        answer: 'D',
        options: [
          'Implement VPLS with BGP auto-discovery and split-horizon forwarding for loop prevention',
          'Deploy Q-in-Q tunneling with provider backbone bridges and spanning tree protocol',
          'Configure MPLS Layer 2 VPN with Martini encapsulation and targeted LDP sessions',
          'Utilize EVPN with VXLAN data plane and MP-BGP control plane for MAC learning',
          'Implement hierarchical VPLS with spoke-site pseudowires and hub-site full mesh'
        ],
        correctAnswer: 'D',
        explanation: 'EVPN-VXLAN provides Layer 2 connectivity with customer isolation, supports VLAN translation, scales efficiently with MP-BGP, and does not require MPLS on customer devices. VPLS requires full mesh which does not scale well, Q-in-Q lacks proper isolation, Martini requires MPLS on CE devices, and H-VPLS still has scaling limitations compared to EVPN.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `An organization's ${topicName} environment experiences a critical issue where multicast traffic for video conferencing applications is causing unexpected network behavior:\n- Multicast streams occasionally duplicate\n- Some receivers miss periodic updates\n- Bandwidth consumption is 3x expected levels\n- Issue occurs only when multiple sources transmit simultaneously\n- Network uses PIM sparse mode with RP auto-discovery\n\nDiagnostics show multiple RPs are being elected for the same multicast groups. Which solution would MOST effectively resolve this issue while maintaining redundancy?`,
        answer: 'B',
        options: [
          'Configure static RP assignment with Anycast RP using MSDP for state synchronization',
          'Implement BSR with consistent priority configuration and RP filtering to ensure single RP per group range',
          'Deploy PIM dense mode for video traffic and maintain sparse mode for other applications',
          'Configure IGMP snooping on all switches with mrouter port configuration',
          'Implement multicast boundary filtering and rate-limiting on all distribution layer devices'
        ],
        correctAnswer: 'B',
        explanation: 'BSR with proper priority ensures single RP election while maintaining automatic failover and preventing the multiple RP issue. Anycast RP with MSDP adds complexity, dense mode floods unnecessarily, IGMP snooping does not address RP election, and boundary filtering does not solve the root cause of multiple RPs.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `A critical ${topicName} deployment for a financial institution requires guaranteed packet delivery with specific latency constraints:\n- Maximum end-to-end latency: 10ms\n- Packet loss tolerance: 0.001%\n- Jitter requirement: <1ms\n- Traffic pattern: Constant bit rate at 100Mbps\n- Path: 8 router hops across metro area\n\nCurrent measurements show average latency of 12ms with occasional spikes to 25ms. Analysis reveals:\n- Serialization delay: 0.5ms per hop\n- Propagation delay: 0.8ms total\n- Processing delay: 0.3ms per device\n- Queuing delay: Variable, 0-20ms\n\nWhich approach would MOST effectively meet the latency requirement?`,
        answer: 'D',
        options: [
          'Increase link bandwidth to 1Gbps to reduce serialization delay across all hops',
          'Implement traffic shaping with token bucket algorithm to smooth traffic bursts',
          'Deploy MPLS traffic engineering with explicit paths to reduce hop count',
          'Configure strict priority queuing with minimal queue depth and admission control',
          'Enable hardware-based fast switching on all routers to reduce processing delay'
        ],
        correctAnswer: 'D',
        explanation: 'Queuing delay (0-20ms) is the primary variable component causing latency spikes. Strict priority queuing with minimal queue depth and admission control eliminates queuing delay for critical traffic. Increasing bandwidth does not significantly reduce serialization at these speeds, shaping adds delay, reducing hops saves only 0.6ms, and fast switching reduces processing by only 0.3ms per hop.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `During ${topicName} implementation, a network experiences intermittent connectivity issues that occur exactly every 30 seconds. Detailed analysis shows:\n- All routing protocols maintain adjacencies\n- No packet loss during connectivity periods\n- Issue affects all protocols (TCP, UDP, ICMP)\n- Occurs simultaneously across all network segments\n- Logs show no errors or warnings\n- Issue started after recent security policy update\n\nPacket captures reveal that during outages, all traffic is being dropped at the network edge. What is the MOST likely cause?`,
        answer: 'C',
        options: [
          'Routing protocol timers causing periodic reconvergence events',
          'Network Time Protocol synchronization causing clock adjustments',
          'Dynamic ACL or firewall rule with time-based policy causing periodic blocks',
          'Spanning Tree Protocol topology changes triggering forwarding state transitions',
          'DHCP lease renewals causing ARP table flushes and connectivity interruption'
        ],
        correctAnswer: 'C',
        explanation: 'Time-based security policies with 30-second intervals match the symptom pattern. The issue affects all traffic types, occurs network-wide, and started after security updates, pointing to centralized policy enforcement. Routing reconvergence would show in logs, NTP adjustments are not periodic, STP changes would show in logs, and DHCP renewals do not occur every 30 seconds.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `A service provider implementing ${topicName} must design a solution for a customer requiring:\n- Layer 3 VPN connectivity between 200 sites\n- Any-to-any communication between all sites\n- Support for overlapping IP address spaces between customers\n- Route target import/export policies for hub-and-spoke traffic patterns\n- Optimal routing without unnecessary hairpinning\n- Scalability to 1000+ sites within 2 years\n\nThe provider's network uses MPLS with BGP. Which architecture provides the BEST combination of scalability and routing efficiency?`,
        answer: 'A',
        options: [
          'MPLS Layer 3 VPN with route reflectors, unique route distinguishers per VRF, and selective route target communities',
          'VPLS with BGP auto-discovery and H-VPLS for hierarchical scaling',
          'IPsec VPN with dynamic multipoint configuration and BGP over GRE tunnels',
          'MPLS Layer 2 VPN with Martini encapsulation and OSPF as customer routing protocol',
          'Carrier Supporting Carrier with nested MPLS labels and LDP label distribution'
        ],
        correctAnswer: 'A',
        explanation: 'MPLS L3 VPN with route reflectors provides optimal scaling, route distinguishers enable overlapping addresses, and route target communities control import/export for hub-spoke patterns while allowing any-to-any. VPLS is Layer 2 only, IPsec lacks provider scalability, L2 VPN does not provide optimal routing, and CSC is for provider interconnection not customer VPNs.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `A ${topicName} network experiences a complex failure scenario:\n- Primary link fails at 10:00 AM\n- Backup link activates successfully\n- At 10:05 AM, primary link recovers\n- Traffic fails to return to primary link\n- At 10:10 AM, backup link fails\n- Complete network outage occurs\n\nInvestigation reveals:\n- Primary link: OSPF cost 10, bandwidth 1Gbps\n- Backup link: OSPF cost 100, bandwidth 100Mbps  \n- Preemption disabled on failover mechanism\n- Both links show as "up/up" in routing table\n- No manual intervention performed\n\nWhat is the ROOT cause of the complete outage?`,
        answer: 'E',
        options: [
          'OSPF cost misconfiguration preventing optimal path selection after recovery',
          'Split-horizon rule preventing route advertisement back to primary link',
          'Routing protocol hold-down timer preventing immediate convergence',
          'Bidirectional Forwarding Detection failure causing incorrect link state',
          'Lack of preemption combined with backup link insufficient capacity causing congestion and failure'
        ],
        correctAnswer: 'E',
        explanation: 'Without preemption, traffic remained on the 100Mbps backup link after primary recovery. When the backup link (carrying 1Gbps traffic load) failed, complete outage occurred because traffic could not instantly reconverge. OSPF cost is irrelevant without preemption, split-horizon applies to distance-vector protocols, hold-down timers do not prevent convergence after link recovery, and BFD would detect failures not prevent preemption.',
        type: 'multiple-choice',
        difficulty: 'hard'
      },
      {
        question: `An organization deploying ${topicName} discovers that certain IPv6 applications fail while IPv4 works correctly. Environment details:\n- Dual-stack network with DHCPv6 and SLAAC\n- IPv6 addresses assigned successfully\n- IPv6 ping works to local subnet\n- IPv6 ping fails to remote subnets\n- IPv4 connectivity fully functional\n- Router advertisements being sent\n- No firewall rules blocking ICMPv6\n\nPacket analysis shows Router Solicitation and Router Advertisement exchange succeeds, but packets to remote destinations receive "Destination Unreachable" from the local router. What is the MOST likely cause?`,
        answer: 'B',
        options: [
          'IPv6 MTU mismatch causing Path MTU Discovery failure and packet drops',
          'Missing or incorrect default route in IPv6 routing table on the router',
          'IPv6 Neighbor Discovery Protocol cache exhaustion preventing address resolution',
          'Duplicate Address Detection failure causing address conflicts',
          'IPv6 extension headers being dropped by intermediate network devices'
        ],
        correctAnswer: 'B',
        explanation: 'Router sending "Destination Unreachable" for remote destinations while local connectivity works indicates missing default route in the router\'s IPv6 routing table. MTU issues would not generate unreachable messages, NDP cache issues would affect local subnet, DAD failure would prevent local connectivity, and extension header issues would cause silent drops not ICMP errors.',
        type: 'multiple-choice',
        difficulty: 'hard'
      }
    );
  }

  if (templates.length === 0) {
    templates.push({
      question: `A network engineer is implementing ${topicName} in a production environment. Which approach represents industry best practice for this deployment?`,
      answer: 'A',
      options: [
        'Conduct thorough planning, implement in a test environment first, then deploy during a maintenance window with rollback plan',
        'Deploy immediately to production to identify real-world issues quickly',
        'Implement changes during business hours for immediate user feedback',
        'Configure all features simultaneously to minimize deployment time',
        'Skip documentation to accelerate the deployment timeline'
      ],
      correctAnswer: 'A',
      explanation: 'Proper planning, testing, and controlled deployment with rollback capability represents industry best practice and minimizes risk to production systems.',
      type: 'multiple-choice',
      difficulty: difficulty
    });
  }

  return templates;
}
